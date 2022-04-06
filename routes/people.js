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
      const document = await Student.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );
      if (!document) throw new Error("Resource not found");
      res.send({ data: formatResponseData(document) });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  };

router.put(
  "/:id",
  authAdmin,
  update(true),
  router.patch("/:id", authAdmin, update(false)),
  router.delete("/:id", authAdmin, async (req, res) => {
    try {
      const document = await Student.findByIdAndDelete(req.params.id);
      if (!document) throw new Error("resource not found");
      res.send({ data: formatResponseData(document) });
    } catch (err) {
      sendResourceNotFound(req, res);
    }
  })
);

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. ‘cars’
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */

function formatResponseData(payload, type = "student") {
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

function sendResourceNotFound(req, res) {
  res.status(404).json({
    errors: [
      {
        status: "404",
        title: "Resource not found",
        description: `We could not find a student with id: ${req.params.id}`,
      },
    ],
  });
}

export default router;
