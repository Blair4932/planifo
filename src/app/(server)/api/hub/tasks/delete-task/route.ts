import prisma from "@/prisma/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const taskId = req.headers.get("id");

  console.log("Task ID from headers:", taskId); // Debugging: Log the taskId

  try {
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    // Check if the task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully.", taskId },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error deleting task:", e); // Debugging: Log the error
    return NextResponse.json(
      {
        error: "Failed to delete task. Please check the logs for more details.",
      },
      { status: 500 }
    );
  }
}
