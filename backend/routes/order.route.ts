import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { createOrder } from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.post("/add-order", isAuthenticated, createOrder)


export default orderRouter