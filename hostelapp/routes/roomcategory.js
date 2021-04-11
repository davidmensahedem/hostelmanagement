const express = require("express");
const { Category, validateCategory } = require("../models/roomcategory");
const router = express.Router();

// GET all room categories

router.get("/roomcategories", async (req, res) => {
  try {
    let roomcategories = await Category.find();
    if (Object.keys(roomcategories).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No room categories available",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successful",
      categories: roomcategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// GET -- a particular category

router.get("/roomcategories/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }
  try {
    let roomcategory = await Category.findById(req.params.id);
    if (!roomcategory) {
      return res.status(400).json({
        success: false,
        message: "No room category with this ID",
      });
    }
    res.status(200).send({
      success: true,
      message: "Successful",
      category: roomcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// POST -- create a category

router.post("/roomcategory", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  try {
    let category = await Category.findOne({ type: req.body.type });
    if (category !== null)
      return res.status(400).json({
        success: false,
        message: "Cateory already created",
      });
    category = new Category({
      type: req.body.type,
    });
    category = await category.save();
    return res.status(200).json({
      success: true,
      message: "Category Created",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Could not create category",
    });
  }
});

// PUT -- update a particular Category

router.put("/category/:id", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "No category with this ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find category",
    });
  }

  try {
    let category = await Category.updateOne(
      { _id: req.params.id },
      {
        type: req.body.type,
      }
    );

    return res.status(200).json({
      success: true,
      message: "category updated successfully",
      updated: category.nModified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update",
    });
  }
});

// DELETE -- a Category

router.delete("/category/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "No category with this ID",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find Category",
    });
  }

  try {
    let category = await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
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
