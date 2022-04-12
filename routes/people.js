import sanitizeBody from "../middleware/sanitizeBody.js";
import Person from "../models/Person.js";
import User from "../models/User.js";
import express from "express";
import authUser from "../middleware/auth.js";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException.js";
import authOwner from "../middleware/authOwner.js";

const router = express.Router();

router.use("/", authUser, sanitizeBody);

router.get("/", async (req, res) => {
  const collection = await Person.find();
  res.send({ data: formatResponseData(collection) });
});

router.post("/", async (req, res, next) => {
  let id;
  await User.findById(req.user._id).then((user) => {
    console.log(user);
    id = user._id;
  });

  const person = new Person(req.sanitizedBody);
  person.owner = id;
  await person
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
      const document = await Person.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );

      if (!document) throw new ResourceNotFoundException("Person not found");
      res.send({ data: formatResponseData(document) });
    } catch (err) {
      next(err);
    }
  };

router.put("/:id", update(true));

router.patch("/:id", update(false));

router.delete("/:id", authOwner, async (req, res, next) => {
  try {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) {
      throw new ResourceNotFoundError(
        `We could not find a person with id: ${req.params.id}`
      );
    }
    res.send({ data: formatResponseData(person) });
  } catch (err) {
    next(err);
  }
});

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
