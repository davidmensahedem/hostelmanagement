const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  role: String,
  isAdmin: Boolean,
  onDuty: Boolean,
  password: String,
  dutyInfo: Schema.Types.Mixed,
});

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "12345");
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

const validateAdmin = function (admin) {
  const schema = Joi.object({
    name: Joi.string().min(3).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(3).required().label("Password"),
  });

  return schema.validate(admin);
};

module.exports.Admin = Admin;
module.exports.validateAdmin = validateAdmin;
