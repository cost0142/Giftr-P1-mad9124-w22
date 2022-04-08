import mongoose from "mongoose";

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
      default: "Current User", // ??????????????????????
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,

      // default: "Current User", // ??? what is this?
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    gifts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gift" }],
    imageUrl: { type: String, maxlength: 1024 },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("Person", schema);

export default Model;
