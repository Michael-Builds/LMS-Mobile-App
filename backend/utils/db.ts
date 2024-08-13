import { DATABASE } from "../config";
import mongoose from "mongoose";
import colors from 'colors';

const connectDB = async () => {
    if (!DATABASE) {
        console.log(colors.bgRed.white('Error: DATABASE connection string is not defined.'));
        return;
    }
    try {
        await mongoose.connect(DATABASE).then((data: any) => {
            console.log(colors.bgGreen.white('Database Connected Successfully!'));
        });
    } catch (error: any) {
        console.log(colors.bgRed.white(`Error Connecting to Database: ${error.message}`));
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;
