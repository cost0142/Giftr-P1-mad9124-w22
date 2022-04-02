import jwt from "jsonwebtoken";
const jwtPrivateKey = "superSecretKey";

function parseToken(headerValue) {
  if (headerValue) {
    const [type, token] = headerValue.split(" "); // ['Bearer', 'awajbfjabfjabajbljgawigfaogf']
    if (type === "Bearer" && typeof token !== "undefined") {
      return token;
    }
  }
  return undefined;
}
export default function (req, res, next) {
  // Do stuff
  const token = parseToken(req.header("Authorization"));
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          status: 401,
          title: "Authentication failed!",
          description: "Missing bearer token!",
        },
      ],
    });
  }
  try {
    const payload = jwt.verify(token, jwtPrivateKey);
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(400).json({
      errors: [
        {
          status: "400",
          title: "Validation Error",
          description: "Invalid bearer token!",
        },
      ],
    });
  }
}
