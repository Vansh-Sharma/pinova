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

const pinRouter = Router();

pinRouter.get("/feed", optionalAuthMiddleware, getFeedValidator, validateRequest, getFeed);
pinRouter.post("/", authMiddleware, createPinValidator, validateRequest, createPin);
pinRouter.post("/:pinId/like", authMiddleware, pinIdParamValidator, validateRequest, toggleLikePin);
pinRouter.post("/:pinId/save", authMiddleware, pinIdParamValidator, validateRequest, toggleSavePin);

export default pinRouter;
