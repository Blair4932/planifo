import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { taskId, title, description, status, points, dueDate } = body;

    console.log(taskId, title, description, status, points, dueDate);

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        points,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
