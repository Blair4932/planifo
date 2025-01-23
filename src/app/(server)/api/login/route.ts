import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log("Input received:", username, password);

    if (!username || !password) {
      console.log("Validation failed: Missing username or password");
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        notes: true,
        tables: true,
      },
    });

    console.log("User found:", user);

    if (!user) {
      console.log("User not found for username:", username);
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (!user.password) {
      console.log("Password missing for user:", username);
      return NextResponse.json(
        { error: "Password is missing for this user" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is not defined");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing JWT_SECRET" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        notes: user.notes,
        tables: user.tables,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("JWT generated successfully");

    return NextResponse.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message, error.stack);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
