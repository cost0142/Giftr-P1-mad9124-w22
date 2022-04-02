import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: { type: String, required: true, maxlength: 16 },
  title: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: false, maxlength: 2048 },
  url: { type: String, required: false, maxlength: 512 },
  students: [
    { type: mongoose.Schema.Types.ObjectId, required: false, ref: "Student" },
  ],
});
const Model = mongoose.model("Course", schema);

export default Model;
