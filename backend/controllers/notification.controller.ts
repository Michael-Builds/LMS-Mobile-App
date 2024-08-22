import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncError";
import notificatioModel from "../model/notification.model";
import ErrorHandler from "../utils/ErrorHandler";

//get all notifications handler for admin
export const getNotifications = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await notificatioModel.find().sort({ createdAt: -1 })

        res.status(201).json({
            success: true,
            message: "Notifications Retrieved",
            notifications
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// update notification status handler for admin
export const updateNotifications = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const notification = await notificatioModel.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        } else {
            // Update status to 'read' only if it's currently 'unread' or any other non-'read' value
            if (notification.status !== 'read') {
                notification.status = 'read';
            }
        }

        await notification.save();

        // Fetch updated notifications
        const notifications = await notificatioModel.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            message: "Message read successfully",
            notifications
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Fetches user notifications
export const getUserNotifications = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
      
        console.log(`Logged in as ${userId}`);
  
        // Fetch notifications for the logged-in user
        const notifications = await notificatioModel.find({ userId: userId }).sort({ createdAt: -1 });
  
        console.log(`Found ${notifications.length} notifications for user ${userId}`);
  
        res.status(200).json({
            success: true,
            message: "User notifications retrieved successfully",
            notifications,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});