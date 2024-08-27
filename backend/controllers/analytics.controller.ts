import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel, { IUser } from "../model/user.model";
import courseModel, { ICourse } from "../model/course.model";
import orderModel, { IOrder } from "../model/order.model";

// Get users analytics controller for admin
export const getUserAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData<IUser>({ model: userModel });
        res.status(200).json({
            success: true,
            users,
            message: "User analytics generated successfully",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get course analytics controller for admin
export const getCourseAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData<ICourse>({
            model: courseModel,
            purchaseField: 'purchased',
            revenueField: 'price'
        });

        res.status(200).json({
            success: true,
            courses,
            message: "Course analytics generated successfully",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Get order analytics controller for admin
export const getOrderAnalytics = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData<IOrder>({ 
            model: orderModel, 
            sumField: 'totalAmount'
        });

        res.status(200).json({
            success: true,
            orders,
            message: "Order analytics generated successfully",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

