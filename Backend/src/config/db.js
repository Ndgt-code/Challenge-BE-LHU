import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://nguyendanggiangtruong_db_user:hE9AAqVFCB7m8VFs@cluster0.rwda16v.mongodb.net/dev?appName=Cluster0");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export default connectDB;
