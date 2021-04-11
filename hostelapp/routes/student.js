const express = require("express");
const { Student, validateStudent } = require("../models/students");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

// GET all students

router.get("/students", async (req, res) => {
  try {
    const student = await Student.find();
    if (Object.keys(student).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students available",
      });
    }
    res.status(200).json({
      success: true,
      message: "Successful",
      students: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't get students",
    });
  }
});

// GET a single student

router.get("/students/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      success: false,
      message: "ID Required",
    });
  try {
    let student = await Student.findById(req.params.id).populate(
      "RoomID ReportID"
    );
    console.log(student);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "No Student with this ID",
      });
    }

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
        "DepartmentID",
      ]),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't get student",
    });
  }
});

// POST --  create a student

router.post("/student", async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  let student = await Student.findOne({ indexNo: req.body.indexNo });
  if (student !== null)
    return res.status(400).json({
      success: false,
      message: "Student already registered",
    });

  student = new Student();

  student.indexNo = req.body.indexNo;
  student.name = req.body.name;
  student.email = req.body.email;
  student.DepartmentID = req.body.DepartmentID;
  student.RoomID = req.body.RoomID;
  student.level = req.body.level;
  let studentPasswordSalt = await bcrypt.genSalt(10);
  student.password = await bcrypt.hash(req.body.password, studentPasswordSalt);

  try {
    student = await student.save();

    const token = student.generateAuthToken();
    return res
      .status(200)
      .header("x-student-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .json({
        success: true,
        message: "Student Registered",
        student: _.pick(student, [
          "indexNo",
          "name",
          "email",
          "DepartmentID",
          "level",
          "RoomID",
          "arrivalDate",
        ]),
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not register",
    });
  }
});

// PUT -- update a particular Student

router.put("/student/:id", async (req, res) => {
  // const { error } = validateStudent(req.body);
  // if (error) {
  //   return res.status(400).json({
  //     success: false,
  //     message: error.details[0].message,
  //   });
  // }

  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "No student with this ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find Student",
    });
  }

  let studentPasswordSalt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, studentPasswordSalt);

  try {
    let student = await Student.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        password: req.body.password,
        level: req.body.level,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      updated: student.nModified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update",
    });
  }
});

// DELETE -- a Student

router.delete("/student/:id", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "No student with this ID",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find Student",
    });
  }

  try {
    let student = await Student.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Couldn't delete",
    });
  }
});

// Export the router object

module.exports = router;
