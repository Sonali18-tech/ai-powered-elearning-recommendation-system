import "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import prisma from "./config/db.js";
import roleRoutes from "./routes/role.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import interactionRoutes from "./routes/interaction.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import difficultyRoutes from "./routes/difficulty.routes.js";
import difficultyDataRoutes from "./routes/difficultyData.routes.js";

const app = express();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", limiter);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LearnAI Backend is running!",
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    application: "LearnAI",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
app.use("/api/admin", adminRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/difficulty", difficultyRoutes);
app.use("/api/difficulty-data", difficultyDataRoutes);

app.listen(PORT, () => {
  console.log(`LearnAI server running on port ${PORT}`);
});
