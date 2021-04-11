const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { Admin, validateAdmin } = require("../models/HostelAdmin");
const bcrypt = require("bcrypt");

// GET -- all Admins

router.get("/hosteladmins", async (req, res) => {
  try {
    let admin = await Admin.find();
    if (Object.keys(admin).length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Admins Available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successful",
      admins: admin,
    });
  } catch (error) {
    if (error)
      return res.status(500).json({
        success: false,
        message: "Couldn't process request",
      });
  }
});

// GET -- a single Admin

router.get("/hosteladmin/:id", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No Admin with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successful",
      admin: _.pick(admin, [
        "_id",
        "name",
        "role",
        "onDuty",
        "isAdmin",
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

// POST -- create an Admin

router.post("/hosteladmin", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin)
    return res.status(400).json({
      success: false,
      message: "Admin already exists",
    });

  try {
    let adminSalt = await bcrypt.genSalt(10);
    admin = new Admin();
    admin.name = req.body.name;
    admin.email = req.body.email;
    admin.role = "Senior Potter";
    admin.isAdmin = true;
    admin.onDuty = true;
    admin.dutyInfo = [
      {
        days: "Mon-Wed",
        time: "6:00am - 6:00pm",
      },
      {
        days: "Thurs-Sun",
        time: "6:00am - 6:00pm",
      },
    ];
    admin.password = await bcrypt.hash(req.body.password, adminSalt);
    admin = await admin.save();
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
    if (error)
      return res.status(500).json({
        success: false,
        message: "Admin not successfully created",
      });
  }
});

// PUT -- update a particular Admin

router.put("/hosteladmin/:id", async (req, res) => {
  const { error } = validateAdmin(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin with this ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find Admin",
    });
  }

  let adminSalt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, adminSalt);

  try {
    let admin = await Admin.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      updated: admin.nModified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update",
    });
  }
});

// DELETE -- an Admin

router.delete("/hosteladmin/:id", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    let admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin with this ID",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find Admin",
    });
  }

  try {
    let admin = await Admin.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
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
