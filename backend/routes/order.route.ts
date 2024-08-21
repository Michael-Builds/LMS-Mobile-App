import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { createOrder, deleteUserOrder, getAllOrders, getUserOrders } from '../controllers/order.controller';
import { authorizeRoles } from '../controllers/user.controller';

const orderRouter = express.Router();

orderRouter.post("/add-order", isAuthenticated, createOrder)

orderRouter.get("/get-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders)

orderRouter.get("/my-orders", isAuthenticated, getUserOrders); 

orderRouter.delete("/delete-order/:id", isAuthenticated, deleteUserOrder);
 
export default orderRouter