const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reportSchema = new Schema({
  info: String,
  date: { type: Date, default: Date.now },
  solved: { type: Boolean, default: false },
  StudentID: { type: Schema.Types.ObjectId, ref: "Student" },
});

const Report = mongoose.model("Report", reportSchema);

const validateReport = function (report) {
  const schema = Joi.object({
    info: Joi.string().min(3).required().label("Report"),
    StudentID: Joi.string().required().label("Student ID"),
  });
  return schema.validate(report);
};

module.exports.Report = Report;
module.exports.validateReport = validateReport;
