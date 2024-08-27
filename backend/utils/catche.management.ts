import { redis } from "../utils/redis";

// Utility to set cache
export const setCache = async (key: string, value: any, expiration: number) => {
    try {
        await redis.set(key, JSON.stringify(value), "EX", expiration);
    } catch (err) {
        console.error(`Error setting cache for key: ${key}`, err);
    }
};

// Utility to get cache
export const getCache = async (key: string) => {
    try {
        const cachedData = await redis.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    } catch (err) {
        console.error(`Error getting cache for key: ${key}`, err);
        return null;
    }
};

// Utility to delete cache
export const delCache = async (key: string) => {
    try {
        await redis.del(key);
    } catch (err) {
        console.error(`Error deleting cache for key: ${key}`, err);
    }
};
