import config from "config";
import mongoose from "mongoose";
import logger from "./logger.js";

const log = logger.child({ module: "connectDB" });

export default async function connectDatabase() {
  const { scheme, host, port, name, username, password, authSource } =
    config.get("db");
  const credentials = username && password ? `${username}:${password}@` : "";

  let connectionString = `${scheme}://${credentials}${host}`;

  if (scheme === "mongodb") {
    connectionString += `:${port}/${name}?authSource=${authSource}`;
  } else {
    connectionString += `/${authSource}?retryWrites=true&w=majority`;
  }

  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      dbName: name,
    });
    log.info(`Connected to MongoDB @ ${name}...`);
  } catch (err) {
    log.error(`Error connecting to MongoDB ...`, err);
    process.exit(1);
  }
}
