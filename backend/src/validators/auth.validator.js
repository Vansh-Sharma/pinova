import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2 to 60 characters"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be 8 to 128 characters"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
];
