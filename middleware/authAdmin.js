import User from "../models/Users.js";

export default async function (req, res, next) {
  const user = await User.findById(req.user._id);
  if (user.isAdmin === true) {
    next();
  } else {
    return res.status(403).send({
      errors: [
        {
          status: "403",
          title: "Access forbidden",
          description: "Access restricted to a certain group of users",
        },
      ],
    });
  }
}
