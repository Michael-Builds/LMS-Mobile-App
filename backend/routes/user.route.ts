import express from 'express';
import {
    accountRegister,
    activateAccount,
    authorizeRoles,
    deactivateAccount,
    deleteUser,
    getAllUsers,
    getUserInfo,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateUserProfile,
    userLogin,
    userLogout,
    requestAccountRecovery,
    approveAccountRecovery,
    rejectAccountRecovery,
    suspendAccount
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", accountRegister);
userRouter.post("/account-activate", activateAccount);
userRouter.post("/login", userLogin);
userRouter.get("/refresh-token", updateAccessToken);
userRouter.post("/social-auth", socialAuth);

// Authenticated User Routes
userRouter.get("/logout", isAuthenticated, userLogout);
userRouter.get("/get-user", isAuthenticated, getUserInfo);
userRouter.put("/update-profile", isAuthenticated, updateUserProfile);
userRouter.put("/update-password", isAuthenticated, updatePassword);
userRouter.post("/deactivate", isAuthenticated, deactivateAccount);

// Account Recovery Routes
userRouter.post("/recover-account", isAuthenticated, requestAccountRecovery);

// Admin Routes
userRouter.get("/get-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
userRouter.delete("/user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

// Admin routes for approving/rejecting account recovery
userRouter.post("/admin/approve-recovery/:id", isAuthenticated, authorizeRoles("admin"), approveAccountRecovery);
userRouter.post("/admin/reject-recovery/:id", isAuthenticated, authorizeRoles("admin"), rejectAccountRecovery);
userRouter.post("/admin/suspend-user/:id", isAuthenticated, authorizeRoles("admin"), suspendAccount);


export default userRouter;