import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import compression from "compression";

import authRoutes from "./routes/auth";
import customersRoutes from "./routes/customers";
import leadsRoutes from "./routes/leads";
import dealsRoutes from "./routes/deals";
import activitiesRoutes from "./routes/activities";
import usersRoutes from "./routes/users";
import analyticsRoutes from "./routes/analytics";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

// Import logger
import logger from "./config/logger";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ FATAL: Missing required environment variables: ${missingEnvVars.join(
      ", "
    )}`
  );
  console.error("❌ Server cannot start without these environment variables.");
  console.error("Please create a .env file in the server directory with:");
  missingEnvVars.forEach((varName) => {
    console.error(`   ${varName}=<your_value>`);
  });
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/crm";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.CLIENT_URL || "",
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Simple HTTP request logging middleware
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Rate limiting (apply to all API routes)
app.use("/api", apiLimiter);

// Health check route
app.get("/", (_req, res) =>
  res.json({
    ok: true,
    message: "BharatNet CRM API Running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

async function start() {
  try {
    // Start server first
    app.listen(PORT, () => {
      logger.info(`🚀 Server listening on http://localhost:${PORT}`);
      logger.info(`📋 API Endpoints available at http://localhost:${PORT}/api`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Try to connect to MongoDB
    try {
      await mongoose.connect(MONGODB_URI, { dbName: "bharatnet-crm" });
      logger.info("🗄️  Connected to MongoDB");
    } catch (mongoErr) {
      logger.warn(
        "⚠️  MongoDB connection failed. API will work but database operations will fail."
      );
      logger.warn(
        "   To fix: Install and start MongoDB, or update MONGODB_URI in .env"
      );
      logger.warn(`   Error: ${(mongoErr as Error).message}`);
    }
  } catch (err) {
    logger.error("❌ Failed to start server", err as Error);
    process.exit(1);
  }
}

start();
