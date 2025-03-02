import prisma from "@/prisma/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const taskId = req.headers.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required in the headers" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });
    console.log("TAAAASK", task);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
