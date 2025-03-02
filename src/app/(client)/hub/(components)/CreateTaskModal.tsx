"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { colourVars } from "../(variables)/colourVars";
import { createTask } from "../(logic)/projectAPI";
import { ProjectStatus } from "../(variables)/status";
import { LoadingSpinner } from "../../(global-components)/loadingSpinner";
import { updateTask } from "../(logic)/projectAPI";
import { deleteTask } from "../(logic)/projectAPI";

export default function CreateTaskModal({
  userId,
  projectId,
  onClose,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  taskId,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    points: 0,
    dueDate: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch task data when taskId changes (including on page load)
  useEffect(() => {
    const urlTaskId = searchParams.get("taskId");
    if (urlTaskId) {
      fetchTask(urlTaskId);
    }
  }, [searchParams]);

  const fetchTask = async (taskId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hub/tasks/get-task`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          taskId: taskId.toString(),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch task");

      const taskData = await res.json();
      setFormData({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "Todo",
        points: taskData.points || 0,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update URL when taskId changes
  useEffect(() => {
    if (taskId) {
      router.replace(`?taskId=${taskId}`);
    } else {
      router.replace(""); // Clear taskId from URL when modal closes
    }
  }, [taskId, router]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl w-full max-w-2xl border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light">
            {taskId ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="h-[475px] justify-center items-center flex">
            <LoadingSpinner />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              !taskId
                ? createTask(
                    e,
                    formData,
                    userId,
                    projectId,
                    onTaskCreated,
                    onClose
                  )
                : updateTask(e, formData, taskId, onTaskUpdated, onClose);
            }}
            className="space-y-6"
          >
            {/* Title spans full width */}
            <div>
              <label className="block mb-2 text-gray-300">Title</label>
              <input
                required
                className="w-full bg-gray-900/50 rounded-lg px-4 py-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Grid for Description (left) and other inputs (right) */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column: Wider Description */}
              <div>
                <label className="block mb-2 text-gray-300">Description</label>
                <textarea
                  className="w-96 h-48 bg-gray-900/50 rounded-lg px-4 py-2 resize-none overflow-y-auto"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Right Column: Narrower inputs */}
              <div className="flex flex-col justify-between ml-32">
                <div>
                  <label className="block mb-2 text-gray-300">Status</label>
                  <select
                    className="bg-gray-900 text-white w-40 px-4 py-2 rounded-lg"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {Object.values(ProjectStatus).map((status) => (
                      <option
                        key={status}
                        className="bg-gray-800"
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">
                    Story Points
                  </label>
                  <input
                    type="number"
                    max="100"
                    className="bg-gray-900/50 rounded-lg w-40 px-4 py-2"
                    value={formData.points}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        points: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Due Date</label>
                  <input
                    type="date"
                    className="bg-gray-900/50 rounded-lg w-40 px-4 py-2"
                    value={
                      formData.dueDate
                        ? formData.dueDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dueDate: e.target.value
                          ? new Date(e.target.value)
                          : null,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Buttons at the bottom */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              {taskId && (
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-700"
                  onClick={() => {
                    deleteTask(taskId, onTaskDeleted);
                  }}
                >
                  Delete Task
                </button>
              )}
              <button
                className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                style={{ backgroundColor: colourVars.hubPurple }}
              >
                {taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
