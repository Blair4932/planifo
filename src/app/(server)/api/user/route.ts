// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // Verify the token and extract user information
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Send the user data as JSON response
    return NextResponse.json({ user: decoded });
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
