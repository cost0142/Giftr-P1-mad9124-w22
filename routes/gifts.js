import createDebug from "debug";
import sanitizeBody from "../middleware/sanitizeBody.js";
import Gift from "../models/Gift.js";
import express from "express";
import authUser from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const debug = createDebug("mad9124-w22-p1-giftr");
const router = express.Router();

router.use("/", authUser, sanitizeBody);

//Gift GET all route
router.get("/", async (req, res) => {
  let gifts = await Gift.find();
  res.send({ data: formatResponseData(gifts) });
});

// Gift POST route
router.post("/", authAdmin, (req, res, next) => {
  new Gift(req.sanitizedBody)
    .save()
    .then((newGift) => res.status(201).json(formatResponseData(newGift)))
    .catch(next);
});

// Gift GET one gift route
router.get("/:id", authUser, async (req, res) => {
  try {
    const document = await Gift.findById(req.params.id);
    if (!document) throw new Error("resource not found");
    res.json({ data: formatResponseData(document) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

// ------------------------------------

// Gift UPDATE route
const update =
  (overwrite = false) =>
  async (req, res) => {
    try {
      const document = await Gift.findByIdAndUpdate(
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

// Gift PUT route
router.put("/:id", authAdmin, update(true));

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

function formatResponseData(payload, type = "course") {
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
        description: `We could not find a course with id: ${req.params.id}`,
      },
    ],
  });
}

export default router;
