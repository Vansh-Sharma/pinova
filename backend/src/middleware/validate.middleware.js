import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new ApiError(422, "Validation failed", result.array());
  }

  next();
}

export default validateRequest;
