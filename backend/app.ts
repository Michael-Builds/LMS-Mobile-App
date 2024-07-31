import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN } from "./config";
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';

export const app = express();

// bodyParser
app.use(express.json({ limit: "50mb" }))

// cookie parser
app.use(cookieParser());

// cors => cross origin sharing
app.use(cors({
    origin: ORIGIN
}));

// routes
app.use("/api/v1", userRouter);

// api testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Test successful"
    });
})

// unknown route access
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
})

app.use(ErrorMiddleware)

