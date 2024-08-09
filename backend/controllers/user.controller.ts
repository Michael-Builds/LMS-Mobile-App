//

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACTIVATION_SECRET, NODE_ENV } from "../config";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import sendEmail from "../utils/sendEmail";
import { sendToken } from "../utils/jwt";

if (!ACTIVATION_SECRET) {
    throw new Error("ACTIVATION_SECRET must be defined");
}

export const Registration = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { fullname, email, password } = req.body;

    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    const user = new User({
        fullname,
        email,
        password,
        avatar: {
            public_id: "default",
            url: "default"
        }
    });

    try {
        await user.save();

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        const data = { user: { fullname: user.fullname }, activationCode };

        await sendEmail({
            email: user.email,
            subject: "Activate your account",
            template: "activation-email.ejs",
            data,
        });

        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account`,
            activationToken: activationToken.token
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({ user, activationCode }, ACTIVATION_SECRET as string, {
        expiresIn: "5m",
    });

    return { token, activationCode };
};

// Activating user account
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

// Controller to activate user account
export const activateAccount = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        const decoded = jwt.verify(
            activation_token,
            ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };

        const { user, activationCode } = decoded;

        if (activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        existingUser.isVerified = true;
        await existingUser.save();

        res.status(200).json({
            success: true,
            message: "Account activated successfully",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

interface ILoginRequest {
    email: string;
    password: string;
}

export const UserLogin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter an email or password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password", 400));
    }

    console.log("Sending token...");
    sendToken(user, 200, res);
    console.log("Token sent. Cookies set:", res.getHeaders()['set-cookie']);
});


export const UserLogout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    // Log cookies before clearing them
    console.log('Clearing cookies:', req.cookies);

    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === 'production',
    });
    res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === 'production',
    });

    // Log cookies after clearing them
    console.log('Cookies after clearing:', req.cookies);

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

