import { app } from "./app";
import colors from 'colors';
import { PORT, NODE_MODE, DATABASE } from "./config";


app.listen(PORT, () => {
    console.log(colors.bgCyan.white(`Server running in ${NODE_MODE} mode on port ${PORT}`))
});
