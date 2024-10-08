import { app } from "./app";
import colors from 'colors';
import { PORT, NODE_ENV, CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } from "./config";
import connectDB from "./utils/db";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY
})

app.listen(PORT || 4000, () => {
    console.log(colors.bgCyan.white(`Server running in ${NODE_ENV} mode on port ${PORT}`))
    connectDB();
});


