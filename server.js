import http from "http";
import app from "./app.js";
import log from "./logger.js";

const httpServer = http.createServer(app);

const port = process.env.PORT || 3030;
httpServer.listen(port, () => {
  log.info(`HTTP server listening on port ${port}`);
});
