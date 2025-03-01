import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        tasks: true,
        sprints: true,
        milestones: true,
      },
    });
    console.log(project);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
