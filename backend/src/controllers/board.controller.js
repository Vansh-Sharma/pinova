import Board from "../models/Board.js";
import Pin from "../models/Pin.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

function sanitizePinIds(pins = []) {
  return [...new Set(pins.map((id) => id.toString()))];
}

export const createBoard = asyncHandler(async (req, res) => {
  const { name, description = "", isPrivate = false, pins = [] } = req.body;
  const pinIds = sanitizePinIds(pins);

  if (pinIds.length) {
    const existingPins = await Pin.countDocuments({ _id: { $in: pinIds } });
    if (existingPins !== pinIds.length) {
      throw new ApiError(400, "One or more pins do not exist");
    }
  }

  const board = await Board.create({
    name,
    description,
    isPrivate,
    pins: pinIds,
    owner: req.user._id,
  });

  await board.populate("owner", "name email");
  await board.populate("pins", "title imageUrl");

  res.status(201).json({
    success: true,
    message: "Board created successfully",
    data: { board },
  });
});

export const getMyBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate("pins", "title imageUrl")
    .populate("owner", "name email");

  res.json({
    success: true,
    data: { boards },
  });
});
