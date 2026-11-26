
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);
const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

const createToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});
// GET CURRENT LOGGED-IN USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Fetch user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user details",
    });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


// START GOOGLE LOGIN
router.get("/google", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  res.cookie("google_oauth_state", state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  const authorizationUrl = googleClient.generateAuthUrl({
  access_type: "online",
  scope: ["openid", "email", "profile"],
  state,
  redirect_uri: process.env.GOOGLE_CALLBACK_URL,
});

  return res.redirect(authorizationUrl);
});

// GOOGLE CALLBACK
router.get("/google/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (
      !code ||
      !state ||
      !req.cookies.google_oauth_state ||
      state !== req.cookies.google_oauth_state
    ) {
      return res.status(400).send("Invalid OAuth request");
    }

    res.clearCookie("google_oauth_state", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
    });

    const { tokens } = await googleClient.getToken(code);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified || !payload.sub) {
      return res.status(401).send("Google account verification failed");
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: payload.name || "LearnAI User",
          email: payload.email.toLowerCase(),
          googleId: payload.sub,
          role: "LEARNER",
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub },
      });
    } else if (user.googleId !== payload.sub) {
      return res.status(401).send("Google account mismatch");
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    setAuthCookie(res, token);

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).send("Google authentication failed");
  }
});


export default router;
