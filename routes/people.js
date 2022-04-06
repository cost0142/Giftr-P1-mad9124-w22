import sanitizeBody from "../middleware/sanitizeBody.js";
import Student from "../models/Person.js";
import User from "../models/Users.js";
import express from "express";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

// const debug = createDebug("mad9124-w21-a3-jwt-auth");

const router = express.Router();

// router.use("/", authUser, sanitizeBody);
router.get("/", authUser, async (req, res) => {
  let user = await User.findById(req.user._id);
  let collection = await Person.find({ owner: user._id }).populate("gifts");
  res.send({ data: collection });
});

// Person POST route.
router.post("/", authUser, sanitizeBody, async (req, res, next) => {
  let newDocument = new Person(req.sanitizedBody);
  try {
    let user = await User.findById(req.user._id);
    newDocument.owner = user;
    await newDocument.save();
    res.status(201).send({ data: newDocument });
  } catch (err) {
    log.errors(err);
    handleError(err);
  }
});

router.get("/:id", authUser, async (req, res) => {
  try {
    const document = await Person.findById(req.params.id).populate("gifts");
    if (!document)
      throw new sendResourceNotFoundException("Resource not found");

    res.send({ data: document });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

const update =
  (overwrite = false) =>
  async (req, res) => {
    try {
      const document = await Person.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );
      if (!document)
        throw new sendResourceNotFoundException("Resource not found");
      res.send({ data: document });
    } catch (err) {
      handleError(req, res);
    }
  };

router.put(
  "/:id",
  authAdmin,
  sanitizeBody,
  update(true),
  router.patch("/:id", authUser, sanitizeBody, update(false))
);

router.delete("/:id", authUser, async (req, res) => {
  try {
    const document = await Person.findByIdAndRemove(req.params.id);
    if (!document)
      throw new sendResourceNotFoundException("Resource not found");
    res.send({ data: document });
  } catch (err) {
    handleErrors(req, res);
  }
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. ‘cars’
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */

function formatResponseData(payload, type = "people") {
  if (payload instanceof Array) {
    return payload.map((resource) => format(resource));
  } else {
    return format(payload);
  }

  function format(resource) {
    const { _id, ...attributes } = resource.toObject();
    return { type, id: _id, attributes };
  }
}

export default router;
