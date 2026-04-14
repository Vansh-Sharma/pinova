import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

const optionalAuthMiddleware = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token for optional auth flows.
  }

  return next();
});

export default optionalAuthMiddleware;
