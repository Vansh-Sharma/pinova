import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signAccessToken } from "../utils/jwt.js";

function toAuthPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
  });

  const accessToken = signAccessToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: toAuthPayload(user),
      accessToken,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken(user._id.toString());

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: toAuthPayload(user),
      accessToken,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: toAuthPayload(req.user),
    },
  });
});
