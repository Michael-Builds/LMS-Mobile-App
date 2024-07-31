import express from 'express';
import { activateAccount, Registration, UserLogin, UserLogout } from "../controllers/user.controller";
import { isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post("/register", Registration);

userRouter.post("/account-activation", activateAccount);

userRouter.post("/login", UserLogin);

userRouter.get("/logout", isAuthenticated, UserLogout);

export default userRouter;
