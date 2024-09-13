import express from 'express';
import {
    accountRegister,
    activateAccount,
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
    suspendAccount,
    updateUserRole,
    resetPasswordRequest,
    resetPassword,
    resendActivationCode
} from '../controllers/user.controller';
import { authorizeRoles, isAuthenticated } from '../middleware/auth.middleware';
import { getNotifications, getUserNotifications, updateNotifications } from '../controllers/notification.controller';

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", accountRegister);
userRouter.post("/account-activate", activateAccount);
userRouter.post("/login", userLogin);
userRouter.get("/refresh-token", updateAccessToken);
userRouter.post("/social-auth", socialAuth);
userRouter.post("/request-password-reset", resetPasswordRequest);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/resend-activation", resendActivationCode);

// Authenticated User Routes
userRouter.get("/logout", isAuthenticated, userLogout);
userRouter.get("/get-user", isAuthenticated, getUserInfo);
userRouter.get("/user-notifications", isAuthenticated, getUserNotifications);
userRouter.put("/update-profile", isAuthenticated, updateUserProfile);
userRouter.put("/update-password", isAuthenticated, updatePassword);
userRouter.post("/deactivate", isAuthenticated, deactivateAccount);

// Account Recovery Routes
userRouter.post("/recover-account", isAuthenticated, requestAccountRecovery);

// Route to get notifications for the logged-in user

// Admin Routes
userRouter.get("/get-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
userRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

// Admin routes for approving/rejecting account recovery
userRouter.post("/approve-recovery/:id", isAuthenticated, authorizeRoles("admin"), approveAccountRecovery);
userRouter.post("/reject-recovery/:id", isAuthenticated, authorizeRoles("admin"), rejectAccountRecovery);
userRouter.post("/suspend-user/:id", isAuthenticated, authorizeRoles("admin"), suspendAccount);

// Admin routes to get notifications and updating notifications
userRouter.get("/get-notifications", isAuthenticated, authorizeRoles("admin"), getNotifications);
userRouter.put("/update-notifications/:id", isAuthenticated, authorizeRoles("admin"), updateNotifications);

// Admin Route to Update User Role
userRouter.put("/update-role", isAuthenticated, authorizeRoles("admin"), updateUserRole);

export default userRouter;
