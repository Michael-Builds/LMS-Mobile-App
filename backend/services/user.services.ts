import { NextFunction, Response } from "express";
import { redis } from "../utils/redis";
import userModel, { IUser } from "../model/user.model";
import notificatioModel from "../model/notification.model";
import sendEmail from "../utils/sendEmail";
import deactivatedModel from "../model/deactivate.model";
import ErrorHandler from "../utils/ErrorHandler";

// Function to get a user by their ID
export const getUserById = async (id: string, res: Response) => {
    // Find the user in the database by their ID
    const userData = await redis.get(id);

    if (userData) {
        const user = JSON.parse(userData)
        res.status(201).json({
            success: true,
            user
        });
    }
}


// Function to suspend an account
export const accountSuspension = async (user: IUser) => {
    const now = new Date();
    const deactivatedUser = new deactivatedModel({
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        deactivatedAt: now,
        isVerified: user.isVerified,
        reason: "Suspended due to multiple failed login attempts",
    });

    await deactivatedUser.save();
    await userModel.findByIdAndDelete(user._id);

    await notificatioModel.create({
        user: user._id,
        title: "Account Suspended",
        message: "Your account has been suspended due to multiple failed login attempts."
    });

    await sendEmail({
        email: user.email,
        subject: "Account Suspension Notification",
        template: "account-suspended.ejs",
        data: {
            fullname: user.fullname,
        },
    });

    console.log(`User ${user.email} has been suspended.`);
};