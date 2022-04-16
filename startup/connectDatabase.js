import mongoose from "mongoose";

export default function () {
  mongoose
    .connect("mongodb://localhost:27017/mad9124", { useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to MongoDB...");
    })
    .catch((err) => {
      console.log("Could not connect to MongoDB...", err.message);
      process.exit(1);
    });
}
