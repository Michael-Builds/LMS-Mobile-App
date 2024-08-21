import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { addToCart, checkoutCart, getCart, removeFromCart } from '../controllers/cart.controller';

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", isAuthenticated, addToCart);

cartRouter.delete("/remove-cart", isAuthenticated, removeFromCart);

cartRouter.get("/get-carts", isAuthenticated, getCart);

cartRouter.post("/checkout", isAuthenticated, checkoutCart);

export default cartRouter