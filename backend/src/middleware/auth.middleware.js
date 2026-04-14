import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    throw new ApiError(401, "Authentication token is missing");
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired authentication token");
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    throw new ApiError(401, "User associated with token no longer exists");
  }

  req.user = user;
  next();
});

export default authMiddleware;
