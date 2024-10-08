import bcrypt from 'bcrypt';
import { CatchAsyncErrors } from './../middleware/catchAsyncError';
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../model/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRY, ACTIVATION_SECRET, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRY, RESET_PASSWORD_SECRET } from '../config';
import sendEmail from '../utils/sendEmail';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUserById, accountSuspension, updateUserRoleService, requestPasswordReset } from '../services/user.services';
import cloudinary from "cloudinary"
import deactivatedModel from '../model/deactivate.model';
import pendingActivationModel from '../model/pendingActivation.model';
import notificatioModel from '../model/notification.model';
import { clearCache, setCache } from '../utils/catche.management';

// Account registration handler
export const accountRegister = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    // Extract fullname, email, avatar and password from the request body
    const { fullname, email, password, avatar } = req.body;

    try {
        // Check if the email already exists in the database
        const isEmailExist = await userModel.exists({ email });

        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // Create a new user instance with the provided details
        const user = new userModel({
            fullname,
            email,
            password,
            avatar: {
                public_id: avatar?.public_id,
                url: avatar?.url,
            }
        });

        await user.save();

        // Generate an activation token and code for the new user
        const { token, activationCode } = createActivationToken(user);

        const data = { user: { fullname: user.fullname }, activationCode };

        await sendEmail({
            email: user.email,
            subject: "Activate your account",
            template: "activation-email.ejs",
            data,
        });

        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account`,
            activationToken: token
        });

    } catch (error: any) {
        // Handle any errors that occur during registration
        return next(new ErrorHandler(error.message || "Registration failed", 500));
    }
});

// Interface for activation token
interface IActivationToken {
    token: string;
    activationCode: string;
}

// Function to create an activation token
export const createActivationToken = (user: IUser): IActivationToken => {
    // Generate a random 4-digit activation code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a JWT token that includes the user's email and the activation code
    const token = jwt.sign(
        { user: { email: user.email }, activationCode },
        ACTIVATION_SECRET as Secret,
        { expiresIn: "25m" }
    );

    // Return the generated token and the activation code
    return { token, activationCode };
}

// Resend activation code handler without email input
export const resendActivationCode = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token } = req.body;

    try {
        // Decode the activation token to get the email
        const decoded = jwt.verify(
            activation_token,
            ACTIVATION_SECRET as string
        ) as { user: { email: string }; activationCode: string };

        const { email } = decoded.user;

        // Find the user in the database
        const user = await userModel.findOne({ email });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if user is already verified
        if (user.isVerified) {
            return next(new ErrorHandler("User is already verified", 400));
        }

        // Generate a new activation token and code
        const { token, activationCode } = createActivationToken(user);

        const data = { user: { fullname: user.fullname }, activationCode };

        // Send the new activation code via email
        await sendEmail({
            email: user.email,
            subject: "Resend Activation Code",
            template: "resend-activation.ejs",
            data,
        });

        res.status(200).json({
            success: true,
            message: `A new activation code has been sent to: ${user.email}`,
            activationToken: token
        });

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Activation token has expired", 400));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid activation token", 400));
        }
        return next(new ErrorHandler("Resend activation code failed", 500));
    }
});


// Interface for activation request
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

// Account activation handler
export const activateAccount = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } = req.body as IActivationRequest;

    try {
        const decoded = jwt.verify(
            activation_token,
            ACTIVATION_SECRET as string
        ) as { user: { email: string }; activationCode: string };

        const { user, activationCode } = decoded;

        if (activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const existingUser = await userModel.findOne({ email: user.email });

        if (!existingUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (existingUser.isVerified) {
            return next(new ErrorHandler("User is already verified", 400));
        }

        existingUser.isVerified = true;
        await existingUser.save();

        res.status(200).json({
            success: true,
            message: "Account activated successfully",
        });

    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Activation link has expired", 400));
        } else if (err.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid activation link", 400));
        }
        return next(new ErrorHandler("Activation failed", 500));
    }
});

// user login interface
interface ILoginRequest {
    email: string;
    password: string;
}

// User login handler with suspension and deactivation checks
export const userLogin = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        // Check if the user has been deactivated (suspended or past deactivation date)
        const deactivatedUser = await deactivatedModel.findOne({ email });
        if (deactivatedUser) {
            const currentDate = new Date();
            const deactivationDate = deactivatedUser.deactivatedAt;

            if (deactivationDate <= currentDate) {
                return next(new ErrorHandler("Your account has been deactivated and cannot be accessed. Please contact support for assistance.", 403));
            } else if (deactivatedUser.reason) {
                return next(new ErrorHandler(deactivatedUser.reason, 403));
            }
        }

        // Check if there's a pending activation (account recovery request)
        const pendingActivation = await pendingActivationModel.findOne({ email });
        if (pendingActivation) {
            return next(new ErrorHandler("Your account recovery request is pending. Please wait for admin approval.", 403));
        }

        // Find the user in the database
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }
        const now = new Date();

        // Check if the user account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            return next(new ErrorHandler("Your account is locked due to multiple failed login attempts. Please try again later.", 403));
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            // Increment login attempts
            user.loginAttempts += 1;
            user.failedLoginTimestamps.push(new Date());


            // Check if there have been 3 failed attempts in the last 24 hours
            const recentFailedAttempts = user.failedLoginTimestamps.filter(
                (timestamp) => now.getTime() - timestamp.getTime() <= 24 * 60 * 60 * 1000
            );

            if (recentFailedAttempts.length >= 3) {
                if (!user.lockUntil) {
                    user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
                } else {
                    user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    if (recentFailedAttempts.length >= 6) {
                        user.lockUntil = null;
                        accountSuspension(user);
                        return next(new ErrorHandler("Your account has been suspended due to multiple failed login attempts.", 403));
                    }
                }
                user.loginAttempts = 0;
            }

            await user.save();
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        user.failedLoginTimestamps = [];
        await user.save();

        // Save user session in Redis with a 1-hour expiration
        await setCache(user?.id, user, 3600)

        // If the credentials are correct, generate tokens and send them in the response
        sendToken(user, 200, res);
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});


// User logout handler
export const userLogout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear the access token cookie by setting its maxAge to 1 millisecond
        res.cookie("access_token", "", { maxAge: 1, httpOnly: true });

        // Clear the refresh token cookie by setting its maxAge to 1 millisecond
        res.cookie("refresh_token", "", { maxAge: 1, httpOnly: true });

        // Extract the authenticated user from the request object
        const user = req.user as IUser;

        if (user) {
            // Convert the user's ObjectId to a string format
            const userId = String(user._id);
            await clearCache(userId);
        } else {
            console.warn("No user found in request, skipping Redis deletion.");
        }
        // Send a success response to the client indicating the user has been logged out
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err: any) {
        // Pass any errors that occur to the global error handler
        return next(new ErrorHandler(err.message, 400));
    }
});

// Update access token handler
export const updateAccessToken = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        // const refresh_token = req.headers["refresh-token"] as string;

        const decoded = jwt.verify(refresh_token, REFRESH_TOKEN as string) as JwtPayload;
        const message = "Couldn't refresh token";

        if (!decoded) {
            return next(new ErrorHandler(message, 400));
        }

        const session = await redis.get(decoded.id);

        if (!session) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        const user = JSON.parse(session);

        const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN as string, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN as string, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });

        // If called within a middleware, continue the request
        if (next) {
            req.user = user;
            return next();
        }
        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        await setCache(user?.id, user, 604800);

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (err: any) {
        return next(new ErrorHandler("Authorization failed", 500));
    }
});


export const resetPasswordRequest = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("User not found with this email", 404));
        }

        // Generate a 4-digit reset code and JWT token
        const { token, activationCode } = createResetPasswordToken(user);

        // Email data
        const data = { user: { fullname: user.fullname }, activationCode };

        // Send email with reset code
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            template: "password-reset.ejs",
            data,
        });

        res.status(200).json({
            success: true,
            message: `A password reset code has been sent to ${user.email}`,
            resetToken: token,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Function to create a reset token with activation code
export const createResetPasswordToken = (user: IUser): IActivationToken => {
    // Generate a random 4-digit code
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a reset JWT token
    const token = jwt.sign(
        { user: { id: user._id }, activationCode },
        RESET_PASSWORD_SECRET as Secret,
        { expiresIn: "25m" }
    );

    return { token, activationCode };
};


export const resetPassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { token, activationCode, newPassword } = req.body;

    try {
        // Decode the JWT and get the user ID and code
        const decoded = jwt.verify(token, RESET_PASSWORD_SECRET as string) as { user: { id: string }; activationCode: string };

        if (decoded.activationCode !== activationCode) {
            return next(new ErrorHandler("Invalid reset code", 400));
        }

        // Find the user by ID
        const user = await userModel.findById(decoded.user.id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Update the password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Reset token has expired", 400));
        } else if (error.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid reset token", 400));
        }
        return next(new ErrorHandler("Password reset failed", 500));
    }
});

// get user infor handler
export const getUserInfo = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId: string;

        // Check for access token in cookies
        const accessToken = req.cookies.access_token;

        if (accessToken) {
            try {
                // Attempt to verify the access token
                const decoded = jwt.verify(accessToken, ACCESS_TOKEN as string) as JwtPayload;
                userId = decoded.id;
            } catch (error: any) {
                if (error.name === 'TokenExpiredError') {
                    // Attempt to refresh the token
                    updateAccessToken(req, res, next);
                    // Check if the token refresh was successful
                    if (req.user) {
                        userId = String(req.user._id);
                    } else {
                        return next(new ErrorHandler("Session expired. Please log in again.", 401));
                    }
                } else {
                    return next(new ErrorHandler("Invalid token. Please log in again.", 401));
                }
            }
        } else {
            return next(new ErrorHandler("No access token found. Please log in.", 401));
        }

        if (!userId) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        // Retrieve user details from Redis or database
        const userSession = await redis.get(userId);

        if (userSession) {
            const userDetails = JSON.parse(userSession);
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                user: userDetails
            });
        } else {
            await getUserById(userId, res);
        }
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

interface ISocialAuthBody {
    fullname: string
    email: string
    avatar: string
}

// Social authentication handler
export const socialAuth = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, fullname, avatar } = req.body as ISocialAuthBody;

        const user = await userModel.findOne({ email });

        if (!user) {
            const newUser = await userModel.create({
                fullname,
                email,
                avatar: {
                    public_id: "",
                    url: avatar,
                }
            });

            sendToken(newUser, 201, res);

        } else {
            sendToken(user, 200, res);
        }
    } catch (err: any) {
        // If an error occurs, pass it to the global error handler with a 400 status code
        return next(new ErrorHandler(err.message, 400));
    }
});

//  update user profile
interface IUpdateUserProfile {
    fullname?: string;
    email?: string;
    avatar?: {
        public_id?: string;
        url?: string;
    };
}

// Update user profile handler
export const updateUserProfile = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullname, email, avatar } = req.body as IUpdateUserProfile;

        const userId = req.user?._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if email needs to be updated and ensure it's not taken
        if (email && email !== user.email) {
            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exists", 400));
            }
            user.email = email;
        }

        // Update fullname if provided
        if (fullname) {
            user.fullname = fullname;
        }

        // Update avatar if provided
        if (avatar && avatar?.url) {
            // If there's an existing avatar, delete it from Cloudinary
            if (user.avatar?.public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar?.public_id);
            }

            // Upload the new avatar to Cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(avatar?.url, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            // Update user avatar details
            user.avatar = {
                public_id: myCloud?.public_id,
                url: myCloud.secure_url,
            };
        }

        // Save updated user information
        await user.save();

        // Update user session in Redis
        await setCache(String(userId), user, 86400);

        // Create a notification for the user
        await notificatioModel.create({
            userId: user._id,
            title: "New User Update",
            message: `User Profile Update ${user.fullname}`,
        });

        res.status(200).json({
            success: true,
            user,
            message: "User profile updated successfully"
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

// Update user password interface
interface IUpdatePassword {
    old_password: string;
    new_password: string;
}

// Update user password handler
export const updatePassword = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { old_password, new_password } = req.body as IUpdatePassword;

        if (!old_password || !new_password) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        const user = await userModel.findById(req.user?._id).select("+password"); // Ensure password is selected

        if (!user || !user.password) {
            return next(new ErrorHandler("User not found or password not set", 404));
        }

        // Compare old password with stored password
        const isPasswordMatch = await user.comparePassword(old_password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid old password", 400));
        }

        // Set and hash the new password before saving
        user.password = await bcrypt.hash(new_password, 10);

        await user.save();

        // Convert user ID to a string explicitly and update Redis
        await setCache(String(req.user?._id), user, 86400);

        // Create a notification for the user
        await notificatioModel.create({
            userId: user._id,
            title: "New User Update",
            message: `User Password Update ${user.fullname}`,
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
    }
});

// Fetch all users handler
export const getAllUsers = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all users from the database
        const users = await userModel.find();

        // Send a response with the retrieved users
        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (err: any) {
        // Handle any errors that occur during fetching users
        return next(new ErrorHandler(err.message, 500));
    }
});

// Delete user by Admin
export const deleteUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Remove user avatar from Cloudinary if exists
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        // Delete the user from the database
        await userModel.findByIdAndDelete(userId);

        // Remove user session from Redis
        await clearCache(userId);

        // Create a notification for the user
        await notificatioModel.create({
            userId: user._id,
            title: "New User Update",
            message: `User Deleted  from database`,
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// User Account deactivation handler
export const deactivateAccount = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Check if the user has already requested deactivation
        if (user.hasRequestedDeactivation) {
            return next(new ErrorHandler("You have already requested account deactivation.", 400));
        }

        // Schedule account deactivation after 1 week
        const deactivationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now

        // Mark the user for deactivation
        user.deactivationDate = deactivationDate;
        user.hasRequestedDeactivation = true;
        await user.save();

        // Create a notification for account deactivation
        await notificatioModel.create({
            userId: user._id,
            title: "Account Deactivation Requested",
            message: `Account is scheduled for deactivation in 7 days by ${user.fullname}`,
        });

        // Send an email notification to the user
        await sendEmail({
            email: user.email,
            subject: "Account Deactivation Scheduled",
            template: "deactivation-email.ejs",
            data: {
                fullname: user.fullname,
                deletionDate: deactivationDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        });

        res.status(200).json({
            success: true,
            message: "Your account is scheduled for deactivation in 7 days. Check your email for more details.",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// User Account recovery request handler
export const requestAccountRecovery = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reason } = req.body;
        const userId = req.user?._id;
        const user = await deactivatedModel.findOne({ _id: userId });

        if (!user) {
            return next(new ErrorHandler("User not found in deactivated records", 404));
        }

        // Check if a recovery request already exists
        const existingRequest = await pendingActivationModel.findOne({ email: user.email });
        if (existingRequest) {
            return next(new ErrorHandler("You have already requested account recovery.", 400));
        }

        // Create a recovery request
        const pendingActivation = new pendingActivationModel({
            fullname: user.fullname,
            email: user.email,
            avatar: user.avatar,
            reason: reason,
        });

        await pendingActivation.save();

        // Create a notification for account recovery request
        await notificatioModel.create({
            userId: user._id,
            title: "Account Recovery Requested",
            message: `Account recovery by ${user.fullname}`,
        });

        // Send email notification to the user
        await sendEmail({
            email: user.email,
            subject: "Account Recovery Request Received",
            template: "account-recovery-request.ejs",
            data: {
                fullname: user.fullname,
                reason,
            },
        });
        res.status(200).json({
            success: true,
            message: "Your account recovery request has been submitted. An admin will review it shortly.",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Admin Approve Account Recovery
export const approveAccountRecovery = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const request = await pendingActivationModel.findById(id);

        if (!request) {
            return next(new ErrorHandler("Recovery request not found", 404));
        }

        const deactivatedUser = await deactivatedModel.findOne({ email: request.email });

        if (!deactivatedUser) {
            return next(new ErrorHandler("User not found in deactivated records", 404));
        }

        // Move the user back to the main user collection
        const restoredUser = new userModel({
            fullname: deactivatedUser.fullname,
            email: deactivatedUser.email,
            avatar: deactivatedUser.avatar,
            isVerified: deactivatedUser.isVerified,
        });

        await restoredUser.save();

        // Remove the user from the deactivated users collection
        await deactivatedModel.deleteOne({ email: request.email });
        await pendingActivationModel.findByIdAndDelete(id);

        // Create a notification for account recovery approval
        await notificatioModel.create({
            userId: restoredUser._id,
            title: "Account Recovery Approved",
            message: `Your account recovery has been approved for ${deactivatedUser.fullname}`,
        });

        // Send email notification to the user
        await sendEmail({
            email: restoredUser.email,
            subject: "Account Recovery Approved",
            template: "account-recovery-approved.ejs",
            data: {
                fullname: restoredUser.fullname,
            },
        });

        res.status(200).json({
            success: true,
            message: "User account has been successfully restored.",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Admin Reject Account Recovery
export const rejectAccountRecovery = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const request = await pendingActivationModel.findById(id);

        if (!request) {
            return next(new ErrorHandler("Recovery request not found", 404));
        }

        // Create a notification for account recovery rejection
        await notificatioModel.create({
            userId: req.user?._id,
            title: "Account Recovery Rejected",
            message: `Account recovery rejection for ${request.fullname}`,
        });

        // Send email notification to the user before deletion
        await sendEmail({
            email: request.email,
            subject: "Account Recovery Request Denied",
            template: "account-recovery-rejected.ejs",
            data: {
                fullname: request.fullname,
                reason: request.reason,
            },
        });

        await pendingActivationModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Recovery request has been rejected and removed.",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Admin suspending account
export const suspendAccount = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Find the user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Move user to the deactivated users collection with a suspension reason
        const deactivatedUser = new deactivatedModel({
            fullname: user.fullname,
            email: user.email,
            avatar: user.avatar,
            deactivatedAt: new Date(),
            isVerified: user.isVerified,
            reason,
        });

        await deactivatedUser.save();

        // Delete the user from the main users collection
        await userModel.findByIdAndDelete(id);

        // Remove user session from Redis
        await clearCache(id);


        // Create a notification for account recovery rejection
        await notificatioModel.create({
            userId: req.user?._id,
            title: "Account Recovery Rejected",
            message: `Account recovery rejection for ${user.fullname}`,
        });

        // Send email notification to the user
        await sendEmail({
            email: user.email,
            subject: "Account Suspension Notification",
            template: "account-suspended.ejs",
            data: {
                fullname: user.fullname,
                reason,
            },
        });

        res.status(200).json({
            success: true,
            message: "User account has been suspended.",
        });
    } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
    }
});

// Controller for updating user role
export const updateUserRole = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, newRole } = req.body;

    try {
        // Call the service function and wait for the result
        const updatedUser = await updateUserRoleService(userId, newRole);

        // Create a notification for account recovery rejection
        await notificatioModel.create({
            userId: req.user?._id,
            title: "Updated user role",
            message: `Role Update Success`,
        });

        // Send a success response
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: updatedUser,
        });
    } catch (error: any) {
        // Handle errors
        next(new ErrorHandler(error.message, error.statusCode || 500));
    }
});