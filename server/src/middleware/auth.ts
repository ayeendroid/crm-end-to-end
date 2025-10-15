import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate JWT_SECRET exists at runtime
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("❌ FATAL: JWT_SECRET environment variable is not set!");
      return res.status(500).json({
        success: false,
        error: { message: "Server configuration error" },
      });
    }

    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({
        success: false,
        error: { message: "Missing authorization header" },
      });

    const token = header.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { message: "Unauthorized" },
    });
  }
}

export default requireAuth;
