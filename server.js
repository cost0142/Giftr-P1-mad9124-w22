import http from "http";
import app from "./app.js";

const httpServer = http.createServer(app);

const port = process.env.PORT || 3030;
httpServer.listen(port, () => {
  console.log(`HTTP server listening on port ${port}`);
});
