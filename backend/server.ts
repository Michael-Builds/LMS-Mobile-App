import { app } from "./app"
import { NODE_ENV, PORT } from "./config"
import colors from 'colors';
import connectDB from "./utils/db";


// Create a server instance
app.listen(PORT, () => {
    console.log(colors.bgCyan.white(`Server running in ${NODE_ENV} mode on port ${PORT}`))
    connectDB()

})