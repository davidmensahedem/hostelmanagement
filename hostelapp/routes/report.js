const express = require("express");
const router = express.Router();
const { Report, validateReport } = require("../models/report");
const { Student } = require("../models/students");
const _ = require("lodash");

// GET -- all reports

router.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find();
    if (Object.keys(reports).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No reports available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successful",
      reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't get reports",
      reports,
    });
  }
});

// GET -- a single report

router.get("/report/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(400).json({
        success: false,
        message: "No report with this ID",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successful",
      report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't get report",
    });
  }
});

// POST -- create a report

router.post("/report", async (req, res) => {
  const { error } = validateReport(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let report = await Report.findOne({ info: req.body.info });
    if (report) {
      return res.status(400).json({
        success: false,
        message: "Reported already",
      });
    }
    report = new Report({
      info: req.body.info,
      StudentID: req.body.StudentID,
    });

    report = await report.save();
    let student = await Student.findByIdAndUpdate(
      report.StudentID,
      {
        $push: {
          ReportID: report._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successful",
      report: _.pick(report, ["_id", "info", "date", "solved", "StudentID"]),
      student,
    });
  } catch (error) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Couldn't create report",
      });
    }
  }
});

// PUT -- update the state of a report (solve = true)
router.put("/report/solved/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }
  try {
    let report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(400).json({
        success: false,
        message: "No report with this ID",
      });
    }

    report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          solved: true,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Successful",
      report,
    });
  } catch (error) {}
});

// Export the router

module.exports = router;
