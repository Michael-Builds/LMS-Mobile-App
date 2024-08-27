import mongoose, { Document, Model, Schema } from "mongoose";


export interface IOrder extends Document {
    courseId: string;
    userId: string;
    paymentInfo: object;
    totalAmount: number;
}

const OrderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    paymentInfo: {
        type: Object,
        required: false,
    }
}, { timestamps: true })

const orderModel: Model<IOrder> = mongoose.model("Order", OrderSchema);

export default orderModel