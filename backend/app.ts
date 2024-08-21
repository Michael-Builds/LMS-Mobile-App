import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN } from "./config";
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from "./routes/course.route";
import orderRouter from './routes/order.route';
import cartRouter from './routes/cart.route';

export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
    origin: ORIGIN,
    credentials: true
}));

// routes
app.use("/auth/api", userRouter);

app.use("/courses/api", courseRouter);

app.use("/order/api", orderRouter);

app.use("/cart/api", cartRouter);

app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});



app.use(ErrorMiddleware);
