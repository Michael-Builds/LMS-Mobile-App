import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN, PORT, SWAGGER_PORT } from "./config";
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from "./routes/course.route";
import orderRouter from './routes/order.route';
import cartRouter from './routes/cart.route';
import analyticsRouter from './routes/analtyics.route';
import layoutRouter from './routes/layout.route';
import "./crons/cronjobs"
import { setupSwagger } from './swagger';
import colors from 'colors';

export const app = express();


// Set up Swagger
setupSwagger(app);

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

app.use("/analytics/api", analyticsRouter);

app.use("/layout/api", layoutRouter);


app.listen(SWAGGER_PORT, () => {
    console.log(colors.bgYellow.white(`Swagger working on Port ${SWAGGER_PORT}`));
});
  
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});



app.use(ErrorMiddleware);
