import { Router } from "express";
import { createBoard, getMyBoards } from "../controllers/board.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateRequest from "../middleware/validate.middleware.js";
import { createBoardValidator } from "../validators/board.validator.js";

const boardRouter = Router();

boardRouter.use(authMiddleware);
boardRouter.post("/", createBoardValidator, validateRequest, createBoard);
boardRouter.get("/me", getMyBoards);

export default boardRouter;
