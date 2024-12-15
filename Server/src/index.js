import { connectDatabase } from './Database.js';
import app from './app.js';
import dotenv from "dotenv";

dotenv.config('./.env');

// Start the server
connectDatabase().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((err) => {
    console.log(err);
});