const express = require("express");
const { Room, validateRoom } = require("../models/rooms");
const router = express.Router();
const _ = require("lodash");
const { Student } = require("../models/students");

// GET -- all room categories

router.get("/rooms", async (req, res) => {
  try {
    let rooms = await Room.find();
    if (Object.keys(rooms).length === 0)
      return res.status(400).json({
        success: false,
        message: "No rooms available",
      });
    return res.status(200).json({
      success: true,
      message: "Successful",
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// GET -- a particular Room

router.get("/rooms/:id", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      success: false,
      message: "ID required",
    });
  }
  try {
    let room = await Room.findById(req.params.id).populate("CategoryID");
    if (!room)
      return res.status(400).json({
        success: false,
        message: "No room with this ID",
      });
    return res.status(200).json({
      success: true,
      message: "Successful",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't process request",
    });
  }
});

// GET -- a room state

router.get("/room/state/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Provide ID",
    });
  }
  try {
    let room = await Room.findById(req.params.id).populate("CategoryID");

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "No room with this ID",
      });
    }

    let roomCount = await Student.find({
      RoomID: req.params.id,
    }).countDocuments();

    // four in a room semi-detached

    if (room.CategoryID.type === "4 (Semi-Detached)") {
      if (roomCount === 8) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount >= 4 && roomCount < 8) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }

    // four in a room detached

    if (room.CategoryID.type === "4 (Detached)") {
      if (roomCount === 4) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount > 1 && roomCount < 4) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }

    // three in a room semi-detached

    if (room.CategoryID.type === "3 (Semi-Detached)") {
      if (roomCount === 6) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount >= 3 && roomCount < 6) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }

    // three in a room detached

    if (room.CategoryID.type === "3 (Detached)") {
      if (roomCount === 3) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount > 1 && roomCount < 3) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }

    // two in a room semi-detached

    if (room.CategoryID.type === "2 (Semi-Detached)") {
      if (roomCount === 4) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount >= 2 && roomCount < 4) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }

    // two in a room detached

    if (room.CategoryID.type === "2 (Detached)") {
      if (roomCount === 2) {
        await Room.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              occupied: true,
            },
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          roomState: `Full - ${roomCount} have occupied the room`,
          roomtype: room.CategoryID.type,
          available: false,
        });
      }
      if (roomCount === 1) {
        return res.status(200).json({
          success: true,
          roomState: `Almost full - ${roomCount} has occupied the room`,
          roomtype: room.CategoryID.type,
          available: true,
        });
      }
      return res.status(200).json({
        success: true,
        roomState: "Available",
        roomtype: room.CategoryID.type,
        available: true,
      });
    }
  } catch (error) {
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Couldn't process request",
      });
    }
  }
});

// POST -- create a Room

router.post("/room", async (req, res) => {
  const { error } = validateRoom(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  try {
    let room = await Room.findOne({ number: req.body.number });
    if (room !== null) return res.status(400).send("Room already created");
    room = new Room({
      number: req.body.number,
      occupied: req.body.occupied,
      CategoryID: req.body.CategoryID,
    });
    room = await room.save();
    res.status(200).json({
      success: true,
      message: "Room Created",
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create room",
    });
  }
});

// PUT -- update a particular Room

router.put("/room/:id", async (req, res) => {
  // const { error } = validateRoom(req.body);
  // if (error) {
  //   return res.status(400).json({
  //     success: false,
  //     message: error.details[0].message,
  //   });
  // }

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "No room with this ID",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't find room",
    });
  }

  try {
    let room = await Room.updateOne(
      { _id: req.params.id },
      {
        number: req.body.number,
        occupied: req.body.occupied,
      }
    );

    return res.status(200).json({
      success: true,
      message: "room updated successfully",
      updated: room.nModified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update",
    });
  }
});

// DELETE -- a Room

router.delete("/room/:id", async (req, res) => {
  if (!req.params) {
    return res.status(400).json({
      success: false,
      message: "ID is required",
    });
  }

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "No room with this ID",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Couldn't find room",
    });
  }

  try {
    let room = await Room.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
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
