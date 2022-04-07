import sanitizeBody from "../middleware/sanitizeBody.js";
import Person from "../models/Person.js";
import User from "../models/User.js";
import express from "express";
import authUser from "../middleware/auth.js";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException.js";

const router = express.Router();

router.use("/", authUser, sanitizeBody);

router.get("/", async (req, res) => {
  const user = await User.findById(req.user._id);
  const collection = await Person.find({ owner: user });
  res.send({ data: formatResponseData(collection) });
});

// Person POST route.
router.post("/", (req, res, next) => {
  new Person(req.sanitizedBody)
    .save()
    .then((newPerson) => res.status(201).json(formatResponseData(newPerson)))
    .catch(next);
});

router.get("/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id).populate("gifts");
    if (!person) {
      throw new ResourceNotFoundException("Person not found");
    }
    res.json(formatResponseData(person));
  } catch (err) {
    next(err);
  }
});

const update =
  (overwrite = false) =>
  async (req, res, next) => {
    try {
      const person = await Person.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );

      if (!person) throw new ResourceNotFoundException("Person not found");
      res.send({ data: person });
    } catch (err) {
      next(err);
    }
  };

router.put("/:id", update(true));

router.patch("/:id", update(false));

router.delete("/:id", async (req, res, next) => {
  try {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) {
      throw new ResourceNotFoundError(
        `We could not find a person with id: ${req.params.id}`
      );
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Format the response data object according to JSON:API v1.0

 * @param {string} type The resource collection name, e.g. 'cars'

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
