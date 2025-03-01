"use client";
import { useState } from "react";
import { colourVars } from "../(variables)/colourVars";
import { createTask } from "../(logic)/projectAPI";
import { ProjectStatus } from "../(variables)/status";

export default function CreateTaskModal({
  userId,
  projectId,
  onClose,
  onTaskCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    points: 0,
    dueDate: new Date(),
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light">Create New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) =>
            createTask(e, formData, userId, projectId, onTaskCreated, onClose)
          }
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 text-gray-300">Title</label>
            <input
              required
              className="w-full bg-gray-900/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Description</label>
            <textarea
              className="w-full bg-gray-900/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-300">Status</label>
              <select
                className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option className="bg-gray-800 text-white" value="">
                  All
                </option>
                {Object.values(ProjectStatus).map((status) => (
                  <option
                    key={status}
                    className="bg-gray-800 text-white"
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Story Points</label>
              <input
                type="number"
                max="100"
                className="w-full bg-gray-900/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.points}
                onChange={(e) =>
                  setFormData({ ...formData, points: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Due Date</label>
              <input
                type="date"
                className="w-full bg-gray-900/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={
                  formData.dueDate
                    ? formData.dueDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              style={{ backgroundColor: colourVars.hubPurple }}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
