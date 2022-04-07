import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 64 },
  price: { type: Number, min: 100, default: 1000 },
  imageUrl: { type: String, min: 1024 },
  store: {
    name: { type: String, maxlength: 254 },
    productURL: { type: String, maxlength: 1024 },
  },
});

const Model = mongoose.model("Gift", schema);

export default Model;
