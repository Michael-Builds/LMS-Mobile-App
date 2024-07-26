import * as dotenv from "dotenv";
dotenv.config();

const { PORT, NODE_MODE, DATABASE, ORIGIN } = process.env;

export { PORT, NODE_MODE, DATABASE, ORIGIN };