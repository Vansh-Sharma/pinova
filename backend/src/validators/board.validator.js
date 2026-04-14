import { body, param } from "express-validator";

export const createBoardValidator = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Board name must be 2 to 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("isPrivate").optional().isBoolean().withMessage("isPrivate must be a boolean"),
  body("pins").optional().isArray({ max: 200 }).withMessage("pins must be an array with up to 200 items"),
  body("pins.*").optional().isMongoId().withMessage("Each pin id must be a valid MongoDB id"),
];

export const boardIdParamValidator = [
  param("boardId").isMongoId().withMessage("boardId must be a valid MongoDB id"),
];
