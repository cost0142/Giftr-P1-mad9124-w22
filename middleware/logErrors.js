import createDebug from "debug";
const debug = createDebug("errorLog");

export default function logError(err, req, res, next) {
  debug(err);
  next();
}
