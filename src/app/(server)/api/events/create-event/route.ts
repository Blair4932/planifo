import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      duration,
      reminder,
      allDay,
      startTime,
      endTime,
      date,
      userId,
    } = await req.json();

    if (!title || !description || !duration || !date || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isNaN(new Date(date).getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const formattedEndTime = endTime === "" ? null : endTime;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        duration,
        reminder,
        allDay,
        startTime,
        endTime: formattedEndTime,
        date: new Date(date),
        userId,
      },
    });

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
