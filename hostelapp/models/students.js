const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const studentSchema = new Schema({
  indexNo: { type: Number, unique: true },
  name: String,
  email: String,
  DepartmentID: { type: Schema.Types.ObjectId, ref: "Department" },
  phone: String,
  avatar: String,
  arrivalDate: { type: Date, default: Date.now },
  departureDate: Date,
  ReportID: [Schema.Types.ObjectId],
  RoomID: { type: Schema.Types.ObjectId, ref: "Room" },
  level: Number,
  password: String,
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      indexNo: this.indexNo,
      email: this.email,
      DepartmentID: this.DepartmentID,
      RoomID: this.RoomID,
      avatar: this.avatar,
      phone: this.phone,
      arrivalDate: this.arrivalDate,
      departureDate: this.departureDate,
      level: this.level,
    },
    "12345"
  );
  return token;
};

const Student = mongoose.model("Student", studentSchema);

const validateStudent = function (student) {
  const schema = Joi.object({
    indexNo: Joi.number().min(8).required().label("Index Number"),
    name: Joi.string().min(3).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    DepartmentID: Joi.string().required().label("Department"),
    RoomID: Joi.string().required().label("Room Number"),
    level: Joi.number().min(3).required().label("Level"),
    password: Joi.string().min(3).required().label("Password"),
  });
  return schema.validate(student);
};

module.exports.Student = Student;
module.exports.validateStudent = validateStudent;
