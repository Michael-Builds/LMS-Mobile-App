import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN } from "./config";
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';

export const app = express();

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser());

// CORS Configuration
app.use(cors({
    origin: ORIGIN,
    credentials: true // Allow credentials
}));

// Routes
app.use("/api/v1", userRouter);

// API Testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Test successful"
    });
});

// Unknown Route Access
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});

// Error Middleware
app.use(ErrorMiddleware);
