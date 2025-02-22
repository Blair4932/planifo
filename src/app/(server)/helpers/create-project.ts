import prisma from "@/prisma/lib/prisma";

export default async function createProject(
  title: string,
  description: string,
  icon: string,
  templateSprint: boolean,
  autoStart: boolean,
  defaultTags: boolean,
  userId: string
) {
  if (!title || !description) {
    console.error("Validation failed: Title and description are required.");
    throw new Error("Title and description required. Try again.");
  }

  if (!userId) {
    console.error("Validation failed: userId is required.");
    throw new Error("No userId found.");
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        icon,
        userId,
        status: autoStart,
      },
    });

    return newProject;
  } catch (error) {
    throw new Error("Error creating project.");
  }
}
