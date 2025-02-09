import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";
import mailjet from "node-mailjet";
import crypto from "crypto";

const mailClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist." },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(2).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const resetEmail = {
      Messages: [
        {
          From: { Email: "admin@manifo.uk", Name: "Manifo" },
          To: [{ Email: email }],
          Subject: "Password Reset Request",
          TextPart: `Hello,\n\nYour password reset token is:\n\n${resetToken}\n\nThis token will expire in 1 hour.\n\nIf you didn’t request this, you can ignore this email.`,
          HTMLPart: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          h3 { color: #2a2a2a; font-size: 24px; margin-bottom: 10px; }
          p { font-size: 16px; line-height: 1.6; color: #555; }
          .footer { margin-top: 20px; font-size: 14px; color: #888; text-align: center; }
          .token { font-size: 18px; font-weight: bold; color: #007BFF; margin: 20px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h3>Password Reset Request</h3>
          <p>Your password reset token is:</p>
          <div class="token">${resetToken}</div>
          <p>This token will expire in 1 hour.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2025 Manifo. All rights reserved.</p>
        </div>
      </body>
      </html>`,
        },
      ],
    };

    const mailjetResponse = await mailClient
      .post("send", { version: "v3.1" })
      .request(resetEmail);

    return NextResponse.json(
      { message: "Password reset email sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/login/forgot-password:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
