import mongoose from "mongoose";
import { gift } from "../models/Gift.js";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 254,
    },
    birthDate: {
      type: Date,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: "Current User",
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    gifts: [gift],
    imageUrl: { type: String, maxlength: 1024 },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("Person", schema);

export default Model;
