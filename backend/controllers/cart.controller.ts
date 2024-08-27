import { Request, Response, NextFunction } from "express";
import cartModel from "../model/cart.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { newOrder } from "../services/order.services";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail";
import userModel from "../model/user.model";
import notificatioModel from "../model/notification.model";
import courseModel from "../model/course.model";
import { addCourseToCart, removeCourseFromCart } from "../services/cart.services";
import { delCache, getCache, setCache } from "../utils/catche.management";

// Add a course to the cart
export const addToCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, quantity } = req.body;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
    }

    // Check if the course exists
    const courseExists = await courseModel.findById(courseId);
    if (!courseExists) {
        return next(new ErrorHandler("Course not found", 404));
    }

    // Check if the user has already purchased the course
    const user = await userModel.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const coursePurchased = user.courses.some((course: any) => course.courseId.toString() === courseId);
    if (coursePurchased) {
        return next(new ErrorHandler("You've already purchased this course", 400));
    }

    // Check if the course is already in the user's cart
    const cart = await cartModel.findOne({ userId });
    if (cart && cart.courses.some((course: any) => course.courseId.toString() === courseId)) {
        return next(new ErrorHandler("Item already exists in cart", 400));
    }

    // Add course to cart using the service
    const updatedCart = await addCourseToCart(userId, courseId, quantity);

    res.status(200).json({
        success: true,
        message: "Course added to cart successfully",
        cart: updatedCart,
    });
});

// Remove a course from the cart
export const removeFromCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.body;
    const userId = req.user?._id as string;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
    }

    try {
        const cart = await removeCourseFromCart(userId, courseId);

        res.status(200).json({
            success: true,
            message: "Course removed from cart successfully",
            cart,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 404));
    }
});

// Get user's cart
export const getCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const cacheKey = `cart_${userId}`;

     // Try to retrieve the cart from cache
     const cachedCart = await getCache(cacheKey);
     if (cachedCart) {
         return res.status(200).json({
             success: true,
             cart: cachedCart,
             message: "Cart retrieved from cache successfully",
         });
    }
    
    const cart = await cartModel.findOne({ userId }).populate("courses.courseId");

    if (!cart) {
        return next(new ErrorHandler("Cart not found", 404));
    }

    // Cache the cart data with an expiration time
    await setCache(cacheKey, cart, 3600);

    res.status(200).json({
        success: true,
        cart,
        message: "CourseS retrieved from cart successfully"
    });
});

// Checkout cart handler
export const checkoutCart = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        const cart = await cartModel.findOne({ userId }).populate("courses.courseId");
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const orderCourses = [];
        let totalPrice = 0;

        // Process each course in the cart
        for (const course of cart.courses) {
            const courseDoc = course.courseId as any;

            if (!courseDoc || !courseDoc._id || !courseDoc.name || !courseDoc.price) {
                return next(new ErrorHandler("Course data is missing or corrupted", 400));
            }

            // Check if the course has already been purchased
            const courseExist = user.courses.some((userCourse: any) => userCourse.courseId.toString() === courseDoc._id.toString());
            if (courseExist) {
                return next(new ErrorHandler(`You've already purchased the course ${courseDoc.name}`, 400));
            }

            // Generate a unique order number for this course
            const orderNumber = new mongoose.Types.ObjectId().toString().slice(0, 6);

            // Add course details to orderCourses array
            orderCourses.push({
                orderNumber,
                name: courseDoc.name,
                price: courseDoc.price,
                quantity: course.quantity,
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            });

            // Add the course to the user's profile
            user.courses.push({ courseId: courseDoc._id });

            // Calculate total price
            totalPrice += courseDoc.price * course.quantity;

            // Update the purchased count for the course
            courseDoc.purchased = (courseDoc.purchased || 0) + course.quantity;

            // Save the course with the updated purchased count
            await courseDoc.save();

            // Create a notification for the user
            await notificatioModel.create({
                userId: user._id,
                title: "New Order",
                message: `You have a new order for ${courseDoc.name}`,
            });

            // Create the order in the database
            await newOrder({
                courseId: courseDoc._id,
                userId,
                quantity: course.quantity,
                paymentInfo: req.body.paymentInfo,
                orderNumber,
            });
        }

        // Prepare email data with all courses
        const mailData = {
            order: {
                courses: orderCourses,
                price: totalPrice.toFixed(2),
            },
        };

        // Send email confirmation
        try {
            await sendEmail({
                email: user.email,
                subject: "Order confirmation",
                template: "checkout-email.ejs",
                data: mailData,
            });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        // Save the user's updated course list
        await user.save();

        // Clear the cart after checkout
        await cartModel.findByIdAndDelete(cart._id);

        // Cache the checkout order data temporarily
        // await redis.set(`checkout_order_${userId}`, JSON.stringify(cart), "EX", 600);
        await delCache(`cart_${userId}`);
        await delCache(`checkout_order_${userId}`);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
        });

    } catch (error) {
        return next(new ErrorHandler("Checkout process failed", 500));
    }
});


