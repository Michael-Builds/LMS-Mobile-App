import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
} from "../config";
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>,
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please provide your full name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        match: [emailRegexPattern, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        enum: ["student", "tutor", "admin"],
        default: "student",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: {
                type: String,
                required: true,
            },
        },
    ],
},
    {
        timestamps: true,
    }
);


// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to sign the Access Token
userSchema.methods.signAccessToken = function () {
    if (!ACCESS_TOKEN) {
        throw new Error("ACCESS_TOKEN is not defined");
    }
    return jwt.sign({ id: this._id }, ACCESS_TOKEN);
};

// Method to sign the Refresh Token
userSchema.methods.signRefreshToken = function () {
    if (!REFRESH_TOKEN) {
        throw new Error("REFRESH_TOKEN is not defined");
    }
    return jwt.sign({ id: this._id }, REFRESH_TOKEN );
};

// Method to compare the entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Model for the User collection
const User = mongoose.model<IUser>("User", userSchema);

export default User;