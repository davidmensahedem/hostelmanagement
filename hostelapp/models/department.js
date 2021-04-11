const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Joi = require("joi");

const departmentSchema = new Schema({
  departmentName: { type: String, unique: true },
  departmentCode: String,
});

const Department = mongoose.model("Department", departmentSchema);

function validateDepartment(department) {
  const schema = Joi.object({
    departmentName: Joi.string().min(5).required().label("Department Name"),
    departmentCode: Joi.string().min(2).required().label("Department Code"),
  });

  return schema.validate(department);
}

module.exports.Department = Department;
module.exports.validateDepartment = validateDepartment;
