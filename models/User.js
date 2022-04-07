import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


const saltRounds = 14;

const schema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true, maxlength: 64 },
    lastName: { type: String, trim: true, maxlength: 64 },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      maxlength: 512,
      set: function (value) {
        return value.toLowerCase();
      },
      validate: {
        validator: (value) => {
          validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    password: { type: String, trim: true, required: true, maxlength: 70 },
    isAdmin: { type: Boolean, trim: true, required: true, default: false },
  },
  { timestamps: true }
);

schema.methods.generateAuthToken = function () {
  const payload = { user: { _id: this._id } };
  return jwt.sign(payload, "superSecretKey", {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({ email: email });
  const badHash = `$2b$${saltRounds}$invalidusernameaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
  const hashedPassword = user ? user.password : badHash;
  const passwordDidMatch = await bcrypt.compare(password, hashedPassword);

  return passwordDidMatch ? user : null;
};

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

schema.plugin(uniqueValidator, {
  message: function (props) {
    if (props.path === " email") {
      return `The email ${props.value} is already in use.`;
    } else {
      return `The ${props.path} ${props.value} is already in use.`;
    }
  },
});

const Model = mongoose.model("User", schema);

export default Model;
