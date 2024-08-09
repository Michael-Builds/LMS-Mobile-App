import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN } from "./config";
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
    origin: ORIGIN,
    credentials: true
}));

app.use("/api/v1", userRouter);

app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});

app.use(ErrorMiddleware);
