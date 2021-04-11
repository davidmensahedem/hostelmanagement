const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Student } = require("../models/students");
const { Admin } = require("../models/HostelAdmin");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const checkStudentToken = require("../middlewares/student");
const checkAdminToken = require("../middlewares/admin");

// GET -- an authorized student

router.get("/auth/student", checkStudentToken, async (req, res) => {
  try {
    let student = await Student.findById(req.student._id);
    return res.status(200).json({
      success: true,
      message: "Successful",
      student: _.pick(student, [
        "_id",
        "name",
        "indexNo",
        "level",
        "RoomID",
        "phone",
        "arrivalDate",
        "avatar",
        "course",
      ]),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// GET -- an authorized Admin

router.get("/auth/admin", checkAdminToken, async (req, res) => {
  try {
    let admin = await Admin.findById(req.admin._id);
    return res.status(200).json({
      success: true,
      message: "Successful",
      admin: _.pick(admin, [
        "name",
        "email",
        "role",
        "isAdmin",
        "onDuty",
        "dutyInfo",
      ]),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// POST -- handle student login

router.post("/auth/login/student", async (req, res) => {
  const { error } = validateStudentLogin(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let student = await Student.findOne({ indexNo: req.body.indexNo });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "You are not registered",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      student.password
    );
    if (!validPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = student.generateAuthToken();
    return res
      .status(200)
      .header("x-student-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .json({
        success: true,
        message: "Successful",
        student: _.pick(student, [
          "indexNo",
          "name",
          "email",
          "course",
          "level",
          "RoomID",
          "arrivalDate",
        ]),
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// POST -- handle Admin login

router.post("/auth/login/admin", async (req, res) => {
  const { error } = validateAdminLogin(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "You are not registered",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = admin.generateAuthToken();
    return res
      .status(200)
      .header("x-admin-auth-token", token)
      .json({
        success: true,
        message: "Successful",
        admin: _.pick(admin, [
          "name",
          "email",
          "role",
          "isAdmin",
          "onDuty",
          "dutyInfo",
        ]),
      });
  } catch (error) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Couldn't process request",
      });
    }
  }
});

function validateStudentLogin(student) {
  const schema = Joi.object({
    indexNo: Joi.number().min(8).required().label("Index Number"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(student);
}

function validateAdminLogin(admin) {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(admin);
}

// Export the router

module.exports = router;
