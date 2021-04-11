const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const courseSchema = new Schema({
  name: String,
});

const Course = mongoose.model("Course", courseSchema);

const validateCourse = function (course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required().label("Course"),
  });

  return schema.validate(course);
};

module.exports.Course = Course;
module.exports.validateCourse = validateCourse;
