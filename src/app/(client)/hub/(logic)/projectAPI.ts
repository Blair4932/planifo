// src/api/projectApi.ts
import { FormData } from "../(interfaces)/formData";

export const fetchProjects = async (userId: string) => {
  console.log("fetching");
  try {
    const res = await fetch("/api/hub/get-projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userId: userId.toString(),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createNewProject = async (projectData: {
  title: string;
  description: string;
  icon: string;
  templateSprint: boolean;
  autoStart: boolean;
  defaultTags: boolean;
  userId: string;
}) => {
  try {
    const res = await fetch("/api/hub/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create project");
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to create Project:", error);
    throw error;
  }
};

export const createTask = async (
  e: any,
  formData: FormData,
  userId: string,
  projectId: string,
  onTaskCreated: any,
  onClose: any
) => {
  e.preventDefault();
  const res = await fetch("/api/hub/tasks/create-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      userId,
      projectId,
      points: formData.points ? formData.points : undefined,
    }),
  });

  if (res.ok) {
    const newTask = await res.json();
    onTaskCreated(newTask);
    onClose();
  }
};
