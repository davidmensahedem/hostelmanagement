const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const roomSchema = new Schema({
  number: { type: Number, unique: true },
  occupied: { type: Boolean, default: false },
  CategoryID: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Room = mongoose.model("Room", roomSchema);

const validateRoom = function (room) {
  const schema = Joi.object({
    number: Joi.number().min(3).required().label("Room Number"),
    occupied: Joi.boolean().label("Room State"),
    CategoryID: Joi.string().required().label("Room Category"),
  });

  return schema.validate(room);
};

module.exports.Room = Room;
module.exports.validateRoom = validateRoom;
