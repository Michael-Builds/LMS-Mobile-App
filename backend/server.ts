import { app } from "./app";
import colors from 'colors';
import { PORT, NODE_ENV } from "./config";
import connectDB from "./utils/db";

app.listen(PORT, () => {
    console.log(colors.bgCyan.white(`Server running in ${NODE_ENV} mode on port ${PORT}`))
    connectDB();
});

