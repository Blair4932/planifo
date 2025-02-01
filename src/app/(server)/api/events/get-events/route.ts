import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {
    const { date, userId } = await request.json(); // Add userId to the request body

    if (!date || !userId) {
      return NextResponse.json(
        { error: "Date and User ID parameters are required" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Fetch events for the specific user and date range
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        userId: userId, // Filter events by the user's ID
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
