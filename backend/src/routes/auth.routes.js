import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, validateRequest, register);
authRouter.post("/login", loginValidator, validateRequest, login);
authRouter.get("/me", authMiddleware, me);

export default authRouter;
