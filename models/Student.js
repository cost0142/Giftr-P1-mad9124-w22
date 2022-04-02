import mongoose from "mongoose";

const schema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 64 },
  lastName: { type: String, required: true, maxlength: 64 },
  nickName: { type: String, required: false, maxlength: 64 },
  eMail: { type: String, required: true, maxlength: 512 },
});

const Model = mongoose.model("Student", schema);

export default Model;
