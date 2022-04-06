import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, min: 4, max: 64 },
  price: { type: Number, min: 100, default: 1000 }, //NOT SURE HOW DEFAULT WORK
  imageUrl: { type: String, min: 1024 },
  store: { type: Object },
  storeName: { type: String, max: 254 },
  storeProductURL: { type: String, max: 1024 },
});

const Model = mongoose.model("Gift", schema);

export default Model;
