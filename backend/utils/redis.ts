import { Redis } from "ioredis";
import { REDIS_URL } from "../config";
import colors from 'colors';

const redisClient = (): Redis => {
    if (!REDIS_URL) {
        throw new Error(colors.bgRed.white(`Redis connection failed: REDIS_URL is not defined`));
    }
    console.log(colors.bgCyan.white(`Connecting to Redis at ${REDIS_URL}`));
    return new Redis(REDIS_URL);
};

export const redis = redisClient(); 
