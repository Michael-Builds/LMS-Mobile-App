import express from 'express';
import { AccountRegister } from '../controllers/user.controller';


const userRouter = express.Router();


userRouter.post("/register", AccountRegister)


export default userRouter;