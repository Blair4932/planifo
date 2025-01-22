import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function GET(req: Request) {
  const userId = req.headers.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required to fetch tables." },
      { status: 400 }
    );
  }

  try {
    const tables = await prisma.table.findMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({ tables });
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables." },
      { status: 500 }
    );
  }
}
