const express = require("express");
const { Department, validateDepartment } = require("../models/department");
const router = express.Router();

// GET all departments

router.get("/departments", async (req, res) => {
  try {
    let departments = await Department.find();
    if (Object.keys(departments).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No departments available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successful",
      departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// GET -- a particular Department

router.get("/departments/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }
  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "No  Department with this ID",
      });
    }
    res.status(200).send({
      success: true,
      message: "Successful",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// POST -- create a Department

router.post("/department", async (req, res) => {
  const { error } = validateDepartment(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  try {
    let department = await Department.findOne({
      departmentCode: req.body.departmentCode,
    });
    if (department)
      return res.status(400).json({
        success: false,
        message: "Department code already created",
      });
    department = new Department({
      departmentCode: req.body.departmentCode,
      departmentName: req.body.departmentName,
    });
    department = await department.save();
    return res.status(200).json({
      success: true,
      message: "Department Created",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Department Name is unique",
    });
  }
});

// PUT -- update a particular Department

router.put("/department/:id", async (req, res) => {
  const { error } = validateDepartment(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "No Department with this ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find Department",
    });
  }

  try {
    let department = await Department.updateOne(
      { _id: req.params.id },
      {
        departmentCode: req.body.departmentCode,
        departmentName: req.body.departmentName,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      updated: department.nModified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update",
    });
  }
});

// DELETE -- a Department

router.delete("/department/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }

  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: "No Department with this ID",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find Department",
    });
  }

  try {
    let department = await Department.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
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
