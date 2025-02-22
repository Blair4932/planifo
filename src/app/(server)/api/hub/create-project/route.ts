import { NextResponse } from "next/server";
import createProject from "../../../helpers/create-project";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      icon,
      templateSprint,
      autoStart,
      defaultTags,
      userId,
    } = body;

    if (!title || !description || !userId) {
      console.error("Validation failed: Missing required fields.");
      return NextResponse.json(
        { error: "Title, description, and userId are required." },
        { status: 400 }
      );
    }

    const project = await createProject(
      title,
      description,
      icon,
      templateSprint,
      autoStart,
      defaultTags,
      userId
    );

    return NextResponse.json({
      message: "Project created successfully",
      project,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "An error occurred while creating the project." },
      { status: 500 }
    );
  }
}
