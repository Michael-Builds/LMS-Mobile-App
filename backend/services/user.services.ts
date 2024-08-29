import { NextFunction, Request, Response } from "express";
import deactivatedModel from "../model/deactivate.model";
import notificatioModel from "../model/notification.model";
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { getCache } from "../utils/catche.management";
import sendEmail from "../utils/sendEmail";
import { RESET_PASSWORD_SECRET, RESET_PASSWORD_EXPIRY } from '../config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { CatchAsyncErrors } from "../middleware/catchAsyncError";

// Function to get a user by their ID
export const getUserById = async (id: string, res: Response) => {

    // Find the user in the database by their ID
    const userData = await getCache(id);

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

export const updateUserRoleService = async (userId: string, newRole: string) => {
    // Validate new role (if applicable)
    const validRoles = ['admin', 'student', 'tutor'];

    if (!validRoles.includes(newRole)) {
        throw new ErrorHandler(`Invalid role: ${newRole}`, 400);
    }

    // Update the user's role in the database
    const user = await userModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });

    if (!user) {
        throw new ErrorHandler("User not found", 404);
    }

    // Create a notification for the user
    await notificatioModel.create({
        userId: user._id,
        title: "Role Updated",
        message: `Your role has been updated to ${newRole}.`,
    });

    // Send an email to the user about the role update
    await sendEmail({
        email: user.email,
        subject: "Role Update Notification",
        template: "role-update.ejs",
        data: {
            fullname: user.fullname,
            role: newRole,
        },
    });

    return user;
};


export const requestPasswordReset = async (email: any) => {
    const user = await userModel.findOne({ email });

    if (!user) {
        throw new ErrorHandler('No user found with this email', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const resetTokenSigned = jwt.sign({ id: user._id, resetToken }, RESET_PASSWORD_SECRET || "", {
        expiresIn: RESET_PASSWORD_EXPIRY,
    });

    const resetLink = `myapp://reset-password?token=${resetTokenSigned}`;

    await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        template: 'reset-password.ejs',
        data: {
            fullname: user.fullname,
            resetLink,
        },
    });

    return resetLink;
};

