import { Response } from "express";
import { IUser } from "../models/user.model";
import { ACCESS_TOKEN_EXPIRE, NODE_ENV, REFRESH_TOKEN_EXPIRE } from "../config";
import { redis } from "./redis";
import ErrorHandler from "./ErrorHandler";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: boolean | "lax" | "none" | "strict" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    if (!user._id) {
        throw new ErrorHandler("User ID is not defined", 400);
    }

    const userId = user._id.toString();
    redis.set(userId, JSON.stringify(user)).catch((err) => {
        throw new ErrorHandler("Failed to set user in Redis", 500);
    });

    const accessTokenExpires = parseInt(ACCESS_TOKEN_EXPIRE ?? "3600", 10) * 1000;
    const refreshTokenExpires = parseInt(REFRESH_TOKEN_EXPIRE ?? "86400", 10) * 1000;

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpires),
        maxAge: accessTokenExpires,
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === 'production',
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpires),
        maxAge: refreshTokenExpires,
        httpOnly: true,
        sameSite: "lax",
        secure: NODE_ENV === 'production',
    };

    console.log('Setting access_token and refresh_token cookies');
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};


