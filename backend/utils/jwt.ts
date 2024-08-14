import { Response } from "express";
import { ACCESS_TOKEN_EXPIRY, NODE_ENV, REFRESH_TOKEN_EXPIRY } from "../config";
import { redis } from "./redis";
import { IUser } from "../model/user.model";

interface ITokenOptions {
    expires?: Date;
    maxAge?: number;
    httpOnly: boolean;
    sameSite: "lax" | "none" | "strict";
    secure?: boolean;
}

// Parse the environment variables and provide default values
const accessTokenExpiry = parseInt(ACCESS_TOKEN_EXPIRY || '3600', 10);
const refreshTokenExpiry = parseInt(REFRESH_TOKEN_EXPIRY || '86400', 10);

// Set options for the access token cookie
export const accessTokenOptions: ITokenOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === 'production' ? true : undefined,
    maxAge: accessTokenExpiry * 60 * 60 * 1000,
    expires: new Date(Date.now() + accessTokenExpiry * 60 * 60 * 1000),
};

// Set options for the refresh token cookie
export const refreshTokenOptions: ITokenOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === 'production' ? true : undefined,
    maxAge: refreshTokenExpiry * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + refreshTokenExpiry * 24 * 60 * 60 * 1000),
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    // Upload session to Redis
    const userId = String(user._id);
    redis.set(userId, JSON.stringify(user));

    // Set cookies
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    // Send response with token information
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};
