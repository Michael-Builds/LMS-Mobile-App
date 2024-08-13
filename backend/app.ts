import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ORIGIN } from "./config"
import { ErrorMiddleware } from "./middleware/error"

export const app = express()

// body parsing
app.use(express.json({ limit: "100mb" }))

// cookies parsing
app.use(cookieParser())

// cors parsing => Protecting our server from unauthorized routes
app.use(cors({
    origin: ORIGIN,
    credentials: true,
}))

// api testing
app.get("/api/testing", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Test successful"
    })
})


app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
});


app.use(ErrorMiddleware);