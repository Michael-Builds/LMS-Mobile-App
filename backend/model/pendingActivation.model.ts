import mongoose, { Document, Schema } from "mongoose";

// Define the schema for pending activations
export interface IPendingActivation extends Document {
    fullname: string;
    email: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    reason: string;
    requestedAt: Date;
}

const pendingActivationSchema: Schema<IPendingActivation> = new Schema({
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
    reason: {
        type: String,
        required: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
});

const pendingActivationModel = mongoose.model<IPendingActivation>("PendingActivation", pendingActivationSchema);
export default pendingActivationModel;
