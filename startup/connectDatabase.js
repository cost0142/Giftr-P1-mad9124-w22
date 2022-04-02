import mongoose from "mongoose";
import createDebug from "debug";
const debug = createDebug("week9:db");

export default function () {
  mongoose
    .connect("mongodb://localhost:27017/mad9124", { useNewUrlParser: true })
    .then(() => {
      debug("Successfully connected to MongoDB ...");
    })
    .catch((err) => {
      debug("Error connecting to MongoDB ... ", err.message);
      process.exit(1);
    });
}
