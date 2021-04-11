const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const categorySchema = new Schema({
  type: String,
});

const Category = mongoose.model("Category", categorySchema);

const validateCategory = function (category) {
  const schema = Joi.object({
    type: Joi.string().min(3).required().label("Category"),
  });

  return schema.validate(category);
};

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
