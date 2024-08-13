import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

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
    courses: Array<{ courseId: string }>
    comparePassword: (password: string) => Promise<boolean>
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
        required: [true, "Please enter your password"],
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
    ]
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

// Compare Password Configuration
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;