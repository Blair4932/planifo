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
    }),
  });

  if (res.ok) {
    const newTask = await res.json();
    onTaskCreated(newTask);
    onClose();
  }
};

export const updateTask = async (
  event: React.FormEvent,
  formData: Record<string, any>,
  taskId: string,
  onTaskUpdated: (task: any) => void,
  onClose: () => void
) => {
  event.preventDefault();

  try {
    const response = await fetch("/api/hub/tasks/update-task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        taskId,
      }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      onTaskUpdated(updatedTask);
      onClose();
    } else {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (
  id: string,
  onTaskDeleted: (task: any) => void
) => {
  try {
    const response = await fetch("/api/hub/tasks/delete-task", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", id: id },
    });

    if (response.ok) {
      console.log(response);
      onTaskDeleted(id);
    } else {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
  } catch (e) {}
};
