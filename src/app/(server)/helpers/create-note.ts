import prisma from "@/prisma/lib/prisma";

export async function createNote(
  title: string,
  content: string | null,
  userId: string
) {
  if (!title) {
    throw new Error("Title is required.");
  }

  if (!userId) {
    throw new Error("No userId found.");
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return newNote;
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("Error creating note.");
  }
}
