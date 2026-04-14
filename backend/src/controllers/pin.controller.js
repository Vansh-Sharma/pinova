import Pin from "../models/Pin.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const mockPins = Array.from({ length: 24 }, (_, index) => ({
  id: `mock-pin-${index + 1}`,
  imageUrl: `https://picsum.photos/id/${1010 + (index % 30)}/900/1200`,
  title: `Mock Inspiration ${index + 1}`,
  description: "Premium visual idea generated in mock API mode.",
  tags: ["design", "inspiration", "mock"],
  author: { id: "mock-author", name: "PinAI Mock" },
  likesCount: 30 + index * 2,
  savesCount: 10 + index,
  likedBy: [],
  savedBy: [],
  createdAt: new Date(Date.now() - index * 86_400_000).toISOString(),
}));

function getActorId(req) {
  return req.user?._id?.toString?.() || "guest-user";
}

function normalizeTags(tags = []) {
  const normalized = tags.map((tag) => tag.trim().toLowerCase().replace(/^#/, "")).filter(Boolean);
  return [...new Set(normalized)];
}

function pinResponse(pin, userId = null) {
  const uid = userId ? userId.toString() : null;
  const likedBy = pin.likedBy || [];
  const savedBy = pin.savedBy || [];

  return {
    id: pin._id || pin.id,
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

function getSortedMockPins(type) {
  const copy = [...mockPins];
  if (type === "trending") {
    return copy.sort((a, b) => {
      if (b.likesCount !== a.likesCount) {
        return b.likesCount - a.likesCount;
      }
      if (b.savesCount !== a.savesCount) {
        return b.savesCount - a.savesCount;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const createPin = asyncHandler(async (req, res) => {
  const { title, description = "", tags = [] } = req.body;
  const imageUrl = req.body.imageUrl || req.body.image;

  if (env.useMockApi) {
    const created = {
      id: `mock-pin-${Date.now()}`,
      imageUrl,
      title,
      description,
      tags: normalizeTags(tags),
      author: req.user
        ? { id: req.user._id, name: req.user.name || "User" }
        : { id: "guest-user", name: "Guest User" },
      likesCount: 0,
      savesCount: 0,
      likedBy: [],
      savedBy: [],
      createdAt: new Date().toISOString(),
    };

    mockPins.unshift(created);

    res.status(201).json({
      success: true,
      message: "Pin created successfully",
      data: {
        pin: pinResponse(created, getActorId(req)),
      },
    });
    return;
  }

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

  if (env.useMockApi) {
    const sortedPins = getSortedMockPins(type);
    const paginatedPins = sortedPins.slice(skip, skip + limit);
    const userId = getActorId(req);

    res.json({
      success: true,
      data: {
        feedType: type,
        page,
        limit,
        total: sortedPins.length,
        hasMore: skip + paginatedPins.length < sortedPins.length,
        pins: paginatedPins.map((pin) => pinResponse(pin, userId)),
      },
    });
    return;
  }

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

  if (env.useMockApi) {
    const userId = getActorId(req);
    const pin = mockPins.find((item) => item.id === pinId);
    if (!pin) {
      throw new ApiError(404, "Pin not found");
    }

    const existingIndex = pin.likedBy.findIndex((id) => id === userId);
    const isLiked = existingIndex === -1;

    if (isLiked) {
      pin.likedBy.push(userId);
      pin.likesCount += 1;
    } else {
      pin.likedBy.splice(existingIndex, 1);
      pin.likesCount = Math.max(0, pin.likesCount - 1);
    }

    res.json({
      success: true,
      message: isLiked ? "Pin liked" : "Pin unliked",
      data: {
        pinId: pin.id,
        isLiked,
        likesCount: pin.likesCount,
      },
    });
    return;
  }

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

  if (env.useMockApi) {
    const userId = getActorId(req);
    const pin = mockPins.find((item) => item.id === pinId);
    if (!pin) {
      throw new ApiError(404, "Pin not found");
    }

    const existingIndex = pin.savedBy.findIndex((id) => id === userId);
    const isSaved = existingIndex === -1;

    if (isSaved) {
      pin.savedBy.push(userId);
      pin.savesCount += 1;
    } else {
      pin.savedBy.splice(existingIndex, 1);
      pin.savesCount = Math.max(0, pin.savesCount - 1);
    }

    res.json({
      success: true,
      message: isSaved ? "Pin saved" : "Pin unsaved",
      data: {
        pinId: pin.id,
        isSaved,
        savesCount: pin.savesCount,
      },
    });
    return;
  }

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
