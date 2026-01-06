import express from "express";
import taskRoute from "./routes/taskRoute.js";
import { connectDB } from "./src/config/db.js";

const app = express();

// Kết nối MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;