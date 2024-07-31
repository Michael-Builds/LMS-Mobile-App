import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;
    
    console.log("Access Token:", access_token); // Log the access token

    if (!access_token) {
        return next(new ErrorHandler("No access token found", 401));
    }

    try {
        const decoded = jwt.verify(access_token, ACCESS_TOKEN as string) as JwtPayload;
        console.log("Decoded Token:", decoded); // Log the decoded token

        if (typeof decoded !== "object" || !decoded.id) {
            return next(new ErrorHandler("Invalid access token structure", 401));
        }

        const user = await redis.get(decoded.id as string);
        console.log("User from Redis:", user); // Log the user data

        if (!user) {
            return next(new ErrorHandler("User not found in Redis", 401));
        }

        req.user = JSON.parse(user);
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return next(new ErrorHandler("Invalid access token", 401));
    }
});
