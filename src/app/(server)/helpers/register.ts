import prisma from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";

export async function registerUser(
  username: string,
  password: string,
  email: string
) {
  if (!username || !password || !email) {
    throw new Error("All fields are required.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });

    return user;
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("Username or Email already exists.");
    }
    throw err;
  }
}
