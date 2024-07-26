import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ORIGIN, DATABASE } from "./config";
export const app = express();

// bodyParser
app.use(express.json({ limit: "50mb" }))

// cookie parser
app.use(cookieParser());

// cors => cross origin sharing
// Our cors allows or disallows getting data or information from a different server or domain
app.use(cors({
    origin: ORIGIN
}));

// api testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Test successful"
    });

})

// unknown route access
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    
})