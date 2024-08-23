import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CatchAsyncErrors } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { ACCESS_TOKEN } from "../config";
import { redis } from "../utils/redis";

export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(access_token, ACCESS_TOKEN as string) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler("Invalid access token", 401));
        }
        // Retrieve user from Redis using the ID from the token
        const user = await redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 401));
        }

        // Attach the user to the request object
        req.user = JSON.parse(user);
        next();
    } catch (error: any) {
        console.error('An error occurred', error.message)
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});