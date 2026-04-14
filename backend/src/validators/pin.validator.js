import { body, param, query } from "express-validator";

export const createPinValidator = [
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("image must be a valid URL"),
  body("imageUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("imageUrl must be a valid URL"),
  body().custom((value) => {
    if (!value.image && !value.imageUrl) {
      throw new Error("Either image or imageUrl is required");
    }
    return true;
  }),
  body("title").trim().isLength({ min: 2, max: 140 }).withMessage("Title must be 2 to 140 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("tags")
    .optional()
    .isArray({ max: 20 })
    .withMessage("Tags must be an array with up to 20 items"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 24 })
    .withMessage("Each tag must be 1 to 24 characters"),
];

export const getFeedValidator = [
  query("type")
    .optional()
    .isIn(["latest", "trending"])
    .withMessage("type must be either latest or trending"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50"),
];

export const pinIdParamValidator = [
  param("pinId").isMongoId().withMessage("pinId must be a valid MongoDB id"),
];
