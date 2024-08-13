import mongoose from "mongoose";
import { DATABASE } from "../config";
import colors from 'colors';


const connectDB = async () => {
    try {
        if (!DATABASE) {
            throw new Error("Database connection string is not defined");
        }
        await mongoose.connect(DATABASE).then((data: any) => {
            console.log(colors.bgGreen.white('Database Connected Successfully!'));
        });
    } catch (error: any) {
        console.log(colors.bgRed.white(`Error Connecting to Database: ${error.message}`));
        // setTimeout(connectDB, 5000);
    }
}

export default connectDB;