import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from 'http';
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/user.js";
// import clientRoute from "./routes/client.js";
import { corsOption } from "./utils/constant.js";
import { connectDB } from "./utils/features.js";


try {
    dotenv.config({ path: "./.env" });
} catch (error) {
    console.error("Failed to    load environment variables:", error);
    process.exit(1); // Exit process if .env fails
}


const app = express();
const mongoUrl = "mongodb://127.0.0.1:27017/solar"
const port = process.env.port || 8000
const server = createServer(app);



app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));


try {
    connectDB(mongoUrl)
} catch (error) {
    console.log(error);
}


app.get("/", async(req, res) => {
    res.json("hello to sunConnect backend");
});

app.use("/user",userRoute);
// app.use ("/client",clientRoute)

app.use(errorMiddleware)

server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

export default app