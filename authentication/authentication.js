const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  return res.status(200).send(user);
});

router.post("/users", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Registered");

    user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    let passwordsalt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();

    const userToken = jwt.sign({ _id: user._id }, "123456");

    res
      .status(200)
      .header("x-auth-token", userToken)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log(error);
  }
});

router.post("/user", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not registered");

    const userToken = jwt.sign({ _id: user._id }, "123456");

    res
      .status(200)
      .header("x-auth-token", userToken)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log(error);
  }
});

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(user);
}

module.exports = router;
