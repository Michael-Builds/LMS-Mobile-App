import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel, { IOrder } from "../model/order.model";
import userModel, { IUser } from "../model/user.model";
import courseModel from "../model/course.model";
import sendEmail from "../utils/sendEmail";
import notificatioModel from "../model/notification.model";
import { newOrder } from "../services/order.services";
import mongoose from "mongoose";

// Create Order
export const createOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId, paymentInfo } = req.body as IOrder;
        const user = await userModel.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if the course has already been purchased
        const courseExist = user.courses.some((course: any) => course.courseId.toString() === courseId);
        if (courseExist) {
            return next(new ErrorHandler("You've already purchased this course", 400));
        }

        const course = await courseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            paymentInfo,
        };

        // Create the order in the database and get the created order
        await newOrder(data);

        // Prepare email data
        const mailData = {
            order: {
                _id: course._id?.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            }
        };

        // Send email confirmation
        try {
            await sendEmail({
                email: user.email,
                subject: "Order confirmation",
                template: "order-confirmation.ejs",
                data: mailData
            });
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        // Add the course to the user's profile
        user.courses.push({ courseId: course._id as mongoose.Types.ObjectId });

        // Save the user's updated course list
        await user.save();

        // Create a notification for the user
        await notificatioModel.create({
            userId: user._id,
            title: "New Order",
            message: `You have a new order for ${course.name}`,
        });

        console.log(`Order confirmation for ${user._id} on ${course.name}`)
        course.purchased = (course.purchased || 0) + 1;

        await course.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get All Orders
export const getAllOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all orders from the database
        const orders = await orderModel.find();

        if (!orders || orders.length === 0) {
            return next(new ErrorHandler("No orders found", 404));
        }

        // Send response with the fetched orders
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// Get All Orders for the Authenticated User
export const getUserOrders = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all orders placed by the authenticated user
        const orders = await orderModel.find({ userId: req.user?._id });

        if (!orders || orders.length === 0) {
            return next(new ErrorHandler("No orders found for this user", 404));
        }

        // Send response with the fetched orders
        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
            message:"Orders fetched successfully"
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete Order by ID for the Authenticated User
export const deleteUserOrder = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Assert that req.user is of type IUser
        const userId = (req.user as IUser)._id;

        // Find the order by ID
        const order = await orderModel.findById(id);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        // Check if the order belongs to the authenticated user
        if (order.userId.toString() !== userId?.toString()) {
            return next(new ErrorHandler("You are not authorized to delete this order", 403));
        }

        // Remove the order from the database
        await orderModel.findByIdAndDelete(id);

        // Optionally, remove the course from the user's profile if needed
        const user = await userModel.findById(userId);
        if (user) {
            user.courses = user.courses.filter(course => course.courseId.toString() !== order.courseId.toString());
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
