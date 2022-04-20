import mongoose from "mongoose";

export const gift = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 64 },
  price: { type: Number, min: 100, default: 1000 },
  imageUrl: { type: String, min: 1024 },
  store: {
    type: Object,
    name: {
      type: String,
      maxlength: 254,
    },
    productURL: {
      type: String,
      maxlength: 1024,
    },
  },
});

const Model = mongoose.model("Gift", gift);

export default Model;
