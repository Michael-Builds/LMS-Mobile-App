import mongoose from "mongoose";
import cartModel from "../model/cart.model";

export const addCourseToCart = async (userId: string, courseId: string, quantity: number) => {
    let cart = await cartModel.findOne({ userId });

    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    if (!cart) {
        cart = await cartModel.create({
            userId,
            courses: [{ courseId, quantity }],
        });
    } else {
        const courseExists = cart.courses.find(course => course.courseId.toString() === courseId);

        if (courseExists) {
            courseExists.quantity += quantity;
        } else {
            cart.courses.push({ courseId: courseObjectId, quantity });
        }
    }

    await cart.save();
    return cart;
};

export const removeCourseFromCart = async (userId: string, courseId: string) => {
    const cart = await cartModel.findOne({ userId });

    if (!cart) throw new Error("Cart not found");

    cart.courses = cart.courses.filter(course => course.courseId.toString() !== courseId);
    await cart.save();
    return cart;
};
