import * as dotenv from "dotenv";
dotenv.config();

const {
    PORT,
    NODE_ENV,
    DATABASE,
    ACTIVATION_SECRET,
    ORIGIN, CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY,
    REDIS_URL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_PASSWORD,
    SMTP_USER,
    SMTP_SERVICE,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    JWT_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    SWAGGER_PORT
} = process.env;

export {
    PORT,
    NODE_ENV,
    DATABASE,
    ORIGIN,
    ACTIVATION_SECRET,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_SECRET_KEY,
    REDIS_URL,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_PASSWORD,
    SMTP_USER,
    SMTP_SERVICE,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    JWT_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    SWAGGER_PORT
};