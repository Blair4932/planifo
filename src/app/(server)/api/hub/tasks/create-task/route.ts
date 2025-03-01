// app/api/hub/tasks/create-task/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, points, dueDate, userId, projectId } =
      body;

    // Validate required fields
    if (!userId || !projectId || !title) {
      return NextResponse.json(
        { error: "Missing required fields (userId, projectId, or title)" },
        { status: 400 }
      );
    }

    // Verify project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to project" },
        { status: 403 }
      );
    }

    // Create new task
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || "",
        status: status || "Todo",
        points: points ? points : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
        projectId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
