import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRY } from "../config";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string
    avatar: {
        public_id: string;
        url: string;
    }
    role: string
    isVerified: boolean
    courses: Array<{ courseId: mongoose.Types.ObjectId }>;
    comparePassword: (password: string) => Promise<boolean>
    signAccessToken: () => string
    signRefreshToken: () => string
    hasRequestedDeactivation: boolean;
    deactivationDate?: Date;
    recoveryToken?: string;
    recoveryTokenExpiry?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter your fullname"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [emailRegexPattern, "Please enter a valid email"]
    },
    password: {
        type: String,
        // required: [true, "Please enter your password"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'tutor'],
        default: "student"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String
        }
    ],
    hasRequestedDeactivation: {
        type: Boolean,
        default: false,
    },
    deactivationDate: {
        type: Date,
    },
    recoveryToken: {
        type: String,
    },
    recoveryTokenExpiry: {
        type: Date,
    },
}, { timestamps: true })


// Hash password before saving it to the database
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error: any) {
        return next(error);
    }
    next();
});


// Method to sign the access token
userSchema.methods.signAccessToken = function () {
    try {
        return jwt.sign({ id: this._id }, ACCESS_TOKEN || "", {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    } catch (error: any) {
        console.error("Error signing access token", error);
        throw new Error("Could not generate access token");
    }
};

// Method to sign the refresh token
userSchema.methods.signRefreshToken = function () {
    try {
        return jwt.sign({ id: this._id }, REFRESH_TOKEN || "", {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
    } catch (error: any) {
        console.error("Error signing refresh token", error);
        throw new Error("Could not generate refresh token");
    }
};

// Compare Password Configuration
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};


const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;