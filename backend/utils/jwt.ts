import { Response } from "express";
import { IUser } from "../models/user.model";
import {
    ACCESS_TOKEN_EXPIRE,
    NODE_ENV,
    REFRESH_TOKEN_EXPIRE
} from "../config";
import { redis } from "./redis";
import ErrorHandler from "./ErrorHandler";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    if (user._id) {
        redis.set(user._id.toString(), JSON.stringify(user));
    } else {
        throw new ErrorHandler("User ID is not defined", 400);
    }

    if (!ACCESS_TOKEN_EXPIRE) {
        throw new Error("ACCESS_TOKEN_EXPIRE is not defined");
    }

    if (!REFRESH_TOKEN_EXPIRE) {
        throw new Error("REFRESH_TOKEN_EXPIRE is not defined");
    }

    const accessTokenExpires = parseInt(ACCESS_TOKEN_EXPIRE, 10);
    const refreshTokenExpires = parseInt(REFRESH_TOKEN_EXPIRE, 10);

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpires * 1000),
        maxAge: accessTokenExpires * 1000,
        httpOnly: true,
        sameSite: "lax"
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpires * 1000),
        maxAge: refreshTokenExpires * 1000,
        httpOnly: true,
        sameSite: "lax"
    };

    if (NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
        accessTokenOptions.sameSite = 'strict';
        refreshTokenOptions.sameSite = 'strict';
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    console.log('Access Token Cookie Set:', res.getHeader('Set-Cookie')); // Log cookie

    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    });
}
