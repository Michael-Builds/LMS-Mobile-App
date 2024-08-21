import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICart extends Document {
    userId: string;
    courses: Array<{ courseId: mongoose.Types.ObjectId, quantity: number }>;
}

const CartSchema = new Schema<ICart>({
    userId: {
        type: String,
        required: true,
    },
    courses: [
        {
            courseId: {
                type: mongoose.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
}, { timestamps: true });

const cartModel: Model<ICart> = mongoose.model("Cart", CartSchema);

export default cartModel;
