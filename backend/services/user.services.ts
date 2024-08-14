import { Response } from "express";
import { redis } from "../utils/redis";

// Function to get a user by their ID
export const getUserById = async (id: string, res: Response) => {
    // Find the user in the database by their ID
    const userData = await redis.get(id);

    if (userData) {
        const user = JSON.parse(userData)
        res.status(201).json({
            success: true,
            user
        });
    }
}
