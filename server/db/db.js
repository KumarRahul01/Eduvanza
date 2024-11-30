import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("DB Connected Successfully!")
  } catch (error) {
    console.log("Server Error", error);
  }
}

export default connectDB;