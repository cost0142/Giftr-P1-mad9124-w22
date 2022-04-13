import mongoose from "mongoose";
import logger from "./logger.js";

const log = logger.child({ module: "connectDB" });

export default function () {
  mongoose
    .connect("mongodb://localhost:27017/mad9124", {
      useNewUrlParser: true,
    })
    .then(() => {
      log.info("Successfully connected to MongoDB ...");
    })
    .catch((err) => {
      log.error("Error connecting to MongoDB ... ", err.message);
      process.exit(1);
    });
}
