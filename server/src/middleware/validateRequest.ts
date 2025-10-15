import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "./errorHandler";

/**
 * Middleware to check validation results from express-validator
 * Must be used after validation chains
 */
export const checkValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.type === "field" ? err.path : "unknown",
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: errorMessages,
      },
    });
  }

  next();
};
