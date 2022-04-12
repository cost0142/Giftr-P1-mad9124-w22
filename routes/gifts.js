import sanitizeBody from "../middleware/sanitizeBody.js";
import Gift from "../models/Gift.js";
import Person from "../models/Person.js";
import express from "express";
import authUser from "../middleware/auth.js";
import authGift from "../middleware/authGifts.js";
import ResourceNotFoundError from "../exceptions/ResourceNotFoundException.js";

const router = express.Router();

router.use("/", authUser, sanitizeBody);

// Gift POST route
router.post("/:id/gifts", authGift, async (req, res, next) => {
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
        req.params.giftId,
        req.sanitizedBody,
        {
          new: true,
          overwrite,
          runValidators: true,
        }
      );

      if (!gift) {
        throw new ResourceNotFoundError(
          `We could not find a gift with id: ${req.params.giftId}`
        );
      }
      const person = await Person.findById(req.params.id);
      let newPerson = person;

      newPerson.gifts.id(req.params.giftId).name = req.sanitizedBody.name;

      newPerson.gifts.id(req.params.giftId).price = req.sanitizedBody.price;

      newPerson.gifts.id(req.params.giftId).imageUrl =
        req.sanitizedBody.imageUrl;

      newPerson.gifts.id(req.params.giftId).store = req.sanitizedBody.store;

      newPerson.gifts.id(req.params.giftId).storeName =
        req.sanitizedBody.storeName;

      newPerson.gifts.id(req.params.giftId).productURL =
        req.sanitizedBody.productURL;

      newPerson.save();

      res.send({ data: formatResponseData(gift) });
    } catch (err) {
      next(err);
    }
  };

// Gift PATCH route
router.patch("/:id/gifts/:giftId", authGift, update(false));

//Gift delete route
router.delete("/:id/gifts/:giftId", authGift, async (req, res, next) => {
  const person = await Person.findById(req.params.id);
  try {
    const document = await Gift.findByIdAndRemove(req.params.giftId);
    person.gifts.id(req.params.giftId).remove();
    person.save();
    if (!document) {
      throw new ResourceNotFoundError(
        `We could not find a gift with id: ${req.params.giftId}`
      );
    }
    res.send({ data: formatResponseData(document) });
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
