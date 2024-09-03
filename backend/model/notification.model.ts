import mongoose, { Document, Model, Schema } from "mongoose";

export interface INotification extends Document {
    title: string;
    message: string;
    status: string;
    userId: string;
    createdAt?: Date; 
    updatedAt?: Date; 
}

const notificationSchema = new Schema<INotification>({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "unread",
        enum: ['read', 'unread'],
    },
}, { timestamps: true })

const notificatioModel: Model<INotification> = mongoose.model("Notification", notificationSchema);

export default notificatioModel