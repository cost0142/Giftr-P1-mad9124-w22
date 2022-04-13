import http from "http";
import app from "./app.js";
import createDebug from "debug";

const debug = createDebug("week9:httpServer");

const httpServer = http.createServer(app);

const port = process.env.PORT || 3030;
httpServer.listen(port, () => {
  debug(`HTTP server listening on port ${port}`);
});
