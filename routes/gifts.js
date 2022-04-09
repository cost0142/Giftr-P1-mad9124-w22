import sanitizeBody from "../middleware/sanitizeBody.js";
import Gift from "../models/Gift.js";
import Person from "../models/Person.js";
import express from "express";
import authUser from "../middleware/auth.js";
import ResourceNotFoundError from "../exceptions/ResourceNotFoundException.js";

const router = express.Router();

router.use("/", authUser, sanitizeBody);

// Gift POST route
router.post("/:id/gifts", async (req, res, next) => {
  const gift = new Gift(req.sanitizedBody);
  const id = req.url.split("/")[1];
  const person = await Person.findById(id);
  let newPerson = person;
  await gift
    .save()
    .then(async (gift) => {
      newPerson.gifts.push(gift);
      await Person.findByIdAndUpdate(id, newPerson).then(() => {
        res.status(201).json(formatResponseData(gift));
      });
    })
    .catch(next);
});

const update =
  (overwrite = false) =>
  async (req, res, next) => {
    try {
      const gift = await Gift.findByIdAndUpdate(
        req.params.id,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );

      if (!gift) {
        throw new ResourceNotFoundError(
          `We could not find a gift with id: ${req.params.id}`
        );
      }
    } catch (err) {
      next(err);
    }
  };

// Gift PATCH route
router.patch("/:id/gifts/:giftId", update(false));

//Gift delete route
router.delete("/:id/gifts/:giftId", async (req, res, next) => {
  try {
    const gift = await Gift.findByIdAndRemove(req.params.id);
    if (!gift) {
      throw new ResourceNotFoundError(
        `We could not find a gift with id: ${req.params.id}`
      );
    }
  } catch (err) {
    next(err);
  }
});

function formatResponseData(payload, type = "gifts") {
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
