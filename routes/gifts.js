import createDebug from "debug";
import sanitizeBody from "../middleware/sanitizeBody.js";
import Gift from "../models/Gift.js";
import express from "express";

import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

import ResourceNotFoundError from "../exceptions/ResourceNotFoundException.js";

const debug = createDebug("mad9124-w22-p1-giftr");
const router = express.Router();

router.use("/", authUser, sanitizeBody);

// Gift POST route
router.post("/", authAdmin, (req, res, next) => {
  new Gift(req.sanitizedBody)
    .save()
    .then((newGift) => res.status(201).json(formatResponseData(newGift)))
    .catch(next);
});

// ------------------------------------

// Gift UPDATE route
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
router.patch("/:id", authAdmin, update(false));

//Gift delete route
router.delete("/:id", authAdmin, async (req, res, next) => {
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

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. ‘cars’
 * @param {Object | Object[]} payload An array or instance object from that collection
 * @returns
 */

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
