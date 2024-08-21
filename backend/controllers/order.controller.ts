import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../model/order.model";
import userModel from "../model/user.model";
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
            user: user._id,
            title: "New Order",
            message: `You have a new order for ${course.name}`,
        });

        if (course.purchased) {
            course.purchased += 1
        }
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
