import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN } from "../config";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import { CatchAsyncErrors } from "./catchAsyncErrors";

export const isAuthenticated = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received cookies", req.cookies); 

    const token = req.cookies.access_token;

    if (!token) {
        return next(new ErrorHandler("Access token not found", 401));
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN as string) as JwtPayload;

        if (!decoded.id) {
            return next(new ErrorHandler("Invalid token", 401));
        }

        const user = await redis.get(decoded.id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = JSON.parse(user);
        next();
    } catch (error) {
        return next(new ErrorHandler("Not authorized to access this route", 401));
    }
});

