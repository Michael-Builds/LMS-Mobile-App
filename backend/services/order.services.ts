import { NextFunction, Response } from "express";
import orderModel from "../model/order.model";

export const newOrder = async (data: any) => {
    try {
        const order = await orderModel.create(data);
        return order
    } catch (error: any) {
        throw new Error(error.message);
    }
};


