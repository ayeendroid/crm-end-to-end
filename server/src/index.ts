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

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/crm";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/", (_req, res) => res.json({ ok: true, message: "CRM API Running" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/users", usersRoutes);

async function start() {
  try {
    // Start server first
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`📋 API Endpoints available at http://localhost:${PORT}/api`);
    });

    // Try to connect to MongoDB
    try {
      await mongoose.connect(MONGODB_URI, { dbName: "crm" });
      console.log("🗄️  Connected to MongoDB");
    } catch (mongoErr) {
      console.warn(
        "⚠️  MongoDB connection failed. API will work but database operations will fail."
      );
      console.warn(
        "   To fix: Install and start MongoDB, or update MONGODB_URI in .env"
      );
      console.warn("   Error:", (mongoErr as Error).message);
    }
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

start();
