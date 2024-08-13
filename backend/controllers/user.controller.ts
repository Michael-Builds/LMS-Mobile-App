import { CatchAsyncErrors } from './../middleware/catchAsyncError';
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import { ACTIVATION_SECRET } from '../config';
import sendEmail from '../utils/sendEmail';


export const AccountRegister = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { fullname, email, password } = req.body;

        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user = new userModel({
            fullname,
            email,
            password,
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

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400))
        }
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400))
    }

})

interface IActivationToken {
    token: string;
    activationCode: string;
}
// Create a new activation token for the user
export const createActivationToken = (user: IUser): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activationCode },
        ACTIVATION_SECRET as Secret, { expiresIn: "5m" });

    return { token, activationCode };
}