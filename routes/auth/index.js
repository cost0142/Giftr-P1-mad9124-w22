import User from "../../models/User.js";
import sanitizeBody from "../../middleware/sanitizeBody.js";
import express from "express";
import authenticate from "../../middleware/auth.js";

const router = express.Router();

router.post("/users", sanitizeBody, (req, res, next) => {
  new User(req.sanitizedBody)
    .save()
    .then((newUser) => res.status(201).json(formatResponseData(newUser)))
    .catch(next);
});

router.get("/users/me", authenticate, async (req, res) => {
  req.user._id;
  const user = await User.findById(req.user._id);
  res.json(formatResponseData(user));
});

//login user and return token
router.post("/tokens", sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;

  const user = await User.authenticate(email, password);

  if (!user) {
    return res.status(401).send({
      errors: [
        {
          status: "401",
          title: "Incorrect username or password.",
        },
      ],
    });
  }

  res.status(201).send({ data: { token: user.generateAuthToken() } });
});

//change password
router.patch("/users/me", authenticate, sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody;
  let user = await User.findOneAndUpdate({ _id: req.user._id }, function (doc) {
    doc.password = password;
    doc.save();
  });
  res.status(200).send({ data: user });
});

function formatResponseData(payload, type = "users") {
  if (payload instanceof Array) {
    return { data: payload.map((resource) => format(resource)) };
  } else {
    return { data: format(payload) };
  }
  function format(resource) {
    const { _id, ...attributes } = resource.toJSON
      ? resource.toJSON()
      : resource;
    return { type, id: _id, attributes };
  }
}

export default router;
