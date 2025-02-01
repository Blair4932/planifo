import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function GET(req: Request) {
  try {
    const rawData = req.headers.get("data");
    const data = rawData ? JSON.parse(rawData) : {};

    if (!data.date || !data.userId) {
      return NextResponse.json(
        { error: "Date and User ID parameters are required" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(data.date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        userId: data.userId,
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
