// Don't forget to use NPM to install Express and Mongoose.
import morgan from "morgan";
import express from "express";
import sanitizeMongo from "express-mongo-sanitize";
import courseRouter from "./routes/courses.js";

import studentRouter from "./routes/students.js";
import authRouter from "./routes/auth/index.js";
import handleError from "./middleware/errorHandler.js";
import logError from "./middleware/logErrors.js";
import connectDatabase from "./startup/connectDatabase.js";

connectDatabase();
const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(sanitizeMongo());

// Routes
app.use("/auth", authRouter);

app.use("/api/courses", courseRouter);
app.use("/api/students", studentRouter);
app.use(logError);
app.use(handleError);
export default app;
