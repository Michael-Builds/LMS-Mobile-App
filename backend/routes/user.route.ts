import express from 'express';
import { accountRegister, activateAccount } from '../controllers/user.controller';
const userRouter = express.Router();


userRouter.post("/register", accountRegister)

userRouter.post("/account-activate", activateAccount)


export default userRouter;