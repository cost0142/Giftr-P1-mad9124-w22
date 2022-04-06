import sanitizeBody from "../middleware/sanitizeBody.js";
import Person from "../models/Person.js";
import User from "../models/Users.js";
import express from "express";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

import ResourceNotFoundException from "../exceptions/ResourceNotFoundException.js";

const debug = createDebug("mad9124-w22-p1-giftr");
const router = express.Router();

router.use("/", authUser, sanitizeBody);

router.get("/", authUser, async (req, res) => {
  let user = await User.findById(req.user._id);
  let collection = await Person.find({ owner: user._id });
  res.send({ data: collection });
});

// Person POST route.
router.post("/", authAdmin, (req, res, next) => {
  new Person(req.sanitizedBody)
    .save()
    .then((newPerson) => res.status(201).json(formatResponseData(newPerson)))
    .catch(next);
});

router.get("/:id", authUser, async (req, res, next) => {
  try {
    const document = await Person.findById(req.params.id).populate("gifts");
    if (!document) throw new ResourceNotFoundException("Resource not found");
    res.json(formatResponseData(gift));
  } catch (err) {
    next(err);
  }
});

const update =
  (overwrite = false) =>
  async (req, res, next) => {
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
      if (!document) throw new ResourceNotFoundException("Resource not found");
      res.send({ data: document });
    } catch (err) {
      next(err);
    }
  };

router.put("/:id", authAdmin, update(true));

router.patch("/:id", authUser, update(false));

router.delete("/:id", authUser, async (req, res, next) => {
  try {
    const document = await Person.findByIdAndRemove(req.params.id);
    if (!document) {
      throw new ResourceNotFoundError(
        `We could not find a gift with id: ${req.params.id}`
      );
    }
  } catch (err) {
    next(err);
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
