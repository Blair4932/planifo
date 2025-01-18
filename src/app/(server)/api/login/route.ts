import { NextResponse } from "next/server";
import prisma from "@/src/app/prisma/lib/prisma"; // Prisma client
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { username, password } = await req.json(); // Get username and password from the request

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // At this point, the user is valid, so we can create the JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email, // Include the email from the user data
      },
      process.env.JWT_SECRET!, // Secret key
      { expiresIn: "1d" } // Token expiration (1 day)
    );

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
