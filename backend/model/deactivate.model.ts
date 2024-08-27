import mongoose, { Document, Schema } from "mongoose";

// Define the schema for deactivated users
export interface IDeactivatedUser extends Document {
    fullname: string;
    email: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    deactivatedAt: Date;
    reason?: string;
    isVerified: boolean;
}

const deactivatedUserSchema: Schema<IDeactivatedUser> = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    deactivatedAt: {
        type: Date,
        default: Date.now,
    },
    reason: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: false,
    },
},{ timestamps: true });

const deactivatedModel = mongoose.model<IDeactivatedUser>("DeactivatedUser", deactivatedUserSchema);
export default deactivatedModel;
