import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
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
