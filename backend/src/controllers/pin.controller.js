import Pin from "../models/Pin.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

function normalizeTags(tags = []) {
  const normalized = tags.map((tag) => tag.trim().toLowerCase().replace(/^#/, "")).filter(Boolean);
  return [...new Set(normalized)];
}

function pinResponse(pin, userId = null) {
  const uid = userId ? userId.toString() : null;
  const likedBy = pin.likedBy || [];
  const savedBy = pin.savedBy || [];

  return {
    id: pin._id,
    imageUrl: pin.imageUrl,
    title: pin.title,
    description: pin.description,
    tags: pin.tags,
    author: pin.author,
    likesCount: pin.likesCount,
    savesCount: pin.savesCount,
    isLiked: uid ? likedBy.some((id) => id.toString() === uid) : false,
    isSaved: uid ? savedBy.some((id) => id.toString() === uid) : false,
    createdAt: pin.createdAt,
  };
}

export const createPin = asyncHandler(async (req, res) => {
  const { title, description = "", tags = [] } = req.body;
  const imageUrl = req.body.imageUrl || req.body.image;

  const pin = await Pin.create({
    imageUrl,
    title,
    description,
    tags: normalizeTags(tags),
    author: req.user._id,
  });

  await pin.populate("author", "name email");

  res.status(201).json({
    success: true,
    message: "Pin created successfully",
    data: {
      pin: pinResponse(pin, req.user._id),
    },
  });
});

export const getFeed = asyncHandler(async (req, res) => {
  const type = req.query.type === "trending" ? "trending" : "latest";
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const sort =
    type === "trending"
      ? { likesCount: -1, savesCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  const [pins, total] = await Promise.all([
    Pin.find()
      .select("+likedBy +savedBy")
      .populate("author", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Pin.countDocuments(),
  ]);

  const userId = req.user?._id || null;

  res.json({
    success: true,
    data: {
      feedType: type,
      page,
      limit,
      total,
      hasMore: skip + pins.length < total,
      pins: pins.map((pin) => pinResponse(pin, userId)),
    },
  });
});

export const toggleLikePin = asyncHandler(async (req, res) => {
  const { pinId } = req.params;
  const userId = req.user._id;

  const pin = await Pin.findById(pinId).select("+likedBy");
  if (!pin) {
    throw new ApiError(404, "Pin not found");
  }

  const existingIndex = pin.likedBy.findIndex((id) => id.toString() === userId.toString());
  const isLiked = existingIndex === -1;

  if (isLiked) {
    pin.likedBy.push(userId);
    pin.likesCount += 1;
  } else {
    pin.likedBy.splice(existingIndex, 1);
    pin.likesCount = Math.max(0, pin.likesCount - 1);
  }

  await pin.save();

  res.json({
    success: true,
    message: isLiked ? "Pin liked" : "Pin unliked",
    data: {
      pinId: pin._id,
      isLiked,
      likesCount: pin.likesCount,
    },
  });
});

export const toggleSavePin = asyncHandler(async (req, res) => {
  const { pinId } = req.params;
  const userId = req.user._id;

  const pin = await Pin.findById(pinId).select("+savedBy");
  if (!pin) {
    throw new ApiError(404, "Pin not found");
  }

  const existingIndex = pin.savedBy.findIndex((id) => id.toString() === userId.toString());
  const isSaved = existingIndex === -1;

  if (isSaved) {
    pin.savedBy.push(userId);
    pin.savesCount += 1;
  } else {
    pin.savedBy.splice(existingIndex, 1);
    pin.savesCount = Math.max(0, pin.savesCount - 1);
  }

  await pin.save();

  res.json({
    success: true,
    message: isSaved ? "Pin saved" : "Pin unsaved",
    data: {
      pinId: pin._id,
      isSaved,
      savesCount: pin.savesCount,
    },
  });
});
