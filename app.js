import morgan from "morgan";
import express from "express";
import sanitizeMongo from "express-mongo-sanitize";

import giftsRouter from "./routes/gifts.js";
import peopleRouter from "./routes/people.js";

import authRouter from "./routes/auth/index.js";
import handleError from "./middleware/errorHandler.js";
import logError from "./middleware/logErrors.js";
import connectDatabase from "./startup/connectDatabase.js";

connectDatabase();
const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(sanitizeMongo());

app.get("/", (req, res) => res.send({ data: { healthStatus: "UP" } }));

// Routes
app.use("/auth", authRouter);
app.use("/api/people", giftsRouter);
app.use("/api/people", peopleRouter);

app.use(logError);
app.use(handleError);
export default app;
