
import crypto from "crypto";
import prisma from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return the same response to prevent email enumeration
    const response = {
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
    };

    if (!user || !user.passwordHash) {
      return res.status(200).json(response);
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expire after 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Invalidate previous unused reset tokens
    await prisma.passwordReset.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetLink =
      `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "LearnAI - Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your LearnAI password.</p>
        <p>This link expires in 15 minutes.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request",
    });
  }
};

import bcrypt from "bcrypt";
// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the received token
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenHash },
    });

    if (
      !resetRecord ||
      resetRecord.used ||
      resetRecord.expiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and consume token atomically
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
      prisma.passwordReset.updateMany({
        where: {
          userId: resetRecord.userId,
          used: false,
          id: { not: resetRecord.id },
        },
        data: { used: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};
