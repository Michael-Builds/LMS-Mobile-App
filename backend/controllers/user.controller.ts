import { CatchAsyncErrors } from './../middleware/catchAsyncError';
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import { ACTIVATION_SECRET } from '../config';
import sendEmail from '../utils/sendEmail';

// Account registration function
export const accountRegister = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { fullname, email, password } = req.body;

    try {
        const isEmailExist = await userModel.exists({ email });
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user = new userModel({ fullname, email, password });

        await user.save();

        const { token, activationCode } = createActivationToken(user);
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
            activationToken: token
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message || "Registration failed", 400));
    }
});

// Interface for activation token
interface IActivationToken {
    token: string;
    activationCode: string;
}

// Function to create activation token
export const createActivationToken = (user: IUser): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        { user: { email: user.email }, activationCode },
        ACTIVATION_SECRET as Secret,
        { expiresIn: "5m" }
    );

    return { token, activationCode };
}

// Interface for activation request
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

// Account activation function
export const activateAccount = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } = req.body as IActivationRequest;

    try {
        const decoded = jwt.verify(
            activation_token,
            ACTIVATION_SECRET as string
        ) as { user: { email: string }; activationCode: string };

        const { user, activationCode } = decoded;

        if (activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const existingUser = await userModel.findOneAndUpdate(
            { email: user.email, isVerified: false },
            { $set: { isVerified: true } },
            { new: true }
        );

        if (!existingUser) {
            return next(new ErrorHandler("Invalid user or already verified", 400));
        }

        res.status(200).json({
            success: true,
            message: "Account activated successfully",
        });

    } catch (err: any) {
        const errorMessage = err.name === 'TokenExpiredError' ? "Activation link has expired" : "Invalid activation link";
        return next(new ErrorHandler(errorMessage, 400));
    }
});
