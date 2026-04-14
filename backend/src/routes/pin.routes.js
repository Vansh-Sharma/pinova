import { Router } from "express";
import {
  createPin,
  getFeed,
  toggleLikePin,
  toggleSavePin,
} from "../controllers/pin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import {
  createPinValidator,
  getFeedValidator,
  pinIdParamValidator,
} from "../validators/pin.validator.js";
import optionalAuthMiddleware from "../middleware/optional-auth.middleware.js";
import env from "../config/env.js";

const pinRouter = Router();
const writeAuthGuard = env.useMockApi ? optionalAuthMiddleware : authMiddleware;
const pinIdValidator = env.useMockApi ? [] : pinIdParamValidator;

pinRouter.get("/feed", optionalAuthMiddleware, getFeedValidator, validateRequest, getFeed);
pinRouter.post("/", writeAuthGuard, createPinValidator, validateRequest, createPin);
pinRouter.post("/:pinId/like", writeAuthGuard, ...pinIdValidator, validateRequest, toggleLikePin);
pinRouter.post("/:pinId/save", writeAuthGuard, ...pinIdValidator, validateRequest, toggleSavePin);

export default pinRouter;
