import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/User";
import { authLimiter, registrationLimiter } from "../middleware/rateLimiter";
import { validateRegistration, validateLogin } from "../middleware/validators";
import { checkValidationResult } from "../middleware/validateRequest";
import { asyncHandler, AppError } from "../middleware/errorHandler";

const router = Router();

// Register (for initial setup)
router.post(
  "/register",
  registrationLimiter,
  validateRegistration,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("User with this email already exists", 400);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Split name into firstName and lastName
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      role: role || "sales",
    });

    await user.save();

    // Generate token
    const jwtSecret =
      process.env.JWT_SECRET || "bharatnet-secret-key-change-in-production";
    const jwtOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRY || "7d") as any,
    };
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      jwtOptions
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
      },
    });
  })
);

// Login
router.post(
  "/login",
  authLimiter,
  validateLogin,
  checkValidationResult,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate token
    const jwtSecret =
      process.env.JWT_SECRET || "bharatnet-secret-key-change-in-production";
    const jwtOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRY || "7d") as any,
    };
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      jwtOptions
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
      },
    });
  })
);

export default router;
