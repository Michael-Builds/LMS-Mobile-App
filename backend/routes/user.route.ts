import express from 'express';
import {
    accountRegister,
    activateAccount,
    getUserInfo,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateUserProfile,
    userLogin,
    userLogout
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
const userRouter = express.Router();


userRouter.post("/register", accountRegister)

userRouter.post("/account-activate", activateAccount)

userRouter.post("/login", userLogin)

userRouter.get("/logout", isAuthenticated, userLogout)

userRouter.get("/refresh-token", updateAccessToken)

userRouter.get("/get-user", isAuthenticated, getUserInfo)

userRouter.post("/social-auth", socialAuth)

userRouter.put("/update-profile", isAuthenticated, updateUserProfile)

userRouter.put("/update-password", isAuthenticated, updatePassword)


// 
// socialAuth
export default userRouter;