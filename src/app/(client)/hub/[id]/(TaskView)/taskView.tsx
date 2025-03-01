"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../(components)/Button";
import Label from "../../(components)/Label";
import { colourVars } from "../../(variables)/colourVars";
import { LoadingSpinner } from "../../../(global-components)/loadingSpinner";
import CreateTaskModal from "../../(components)/CreateTaskModal";
import { ProjectStatus } from "../../(variables)/status";

interface TaskViewProps {
  filteredTasks: any;
  setModalOpen: (open: boolean) => void;
  modalOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  isCondensedView: boolean;
  setIsCondensedView: (condensed: boolean) => void;
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  user: any;
  params: any;
}

const TaskView: React.FC<TaskViewProps> = ({
  filteredTasks,
  setModalOpen,
  modalOpen,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  isCondensedView,
  setIsCondensedView,
  tasks,
  setTasks,
  user,
  params,
}) => {
  return (
    <>
      {/* Main Content */}
      <main className="pt-28 px-40 max-w-[1600px] mx-auto h-[calc(100vh-7rem)]">
        {/* Controls Section */}
        <div className=" mt-10 flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <Label
              children={`Active Tasks (${filteredTasks.length})`}
              color={colourVars.hubGreen}
            />
            <Button
              onClick={() => setModalOpen(true)}
              children={"Create Task"}
              color={colourVars.hubPurple}
            />
          </div>

          <div className="flex gap-6">
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
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
            <Button
              onClick={() => setIsCondensedView(!isCondensedView)}
              children={isCondensedView ? "Go Large" : "Go Small"}
              color={colourVars.hubGrey}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-22rem)] pr-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 ${
                isCondensedView ? "p-3" : "p-5"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3
                    className={`font-medium transition-all duration-300 w-[300px] ${
                      isCondensedView ? "text-base" : "text-xl"
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-sm transition-all duration-300 ${
                    task.status === "Done"
                      ? "bg-green-900/50 text-green-400"
                      : task.status === "In Progress"
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-gray-700/50 text-gray-300"
                  }`}
                >
                  {task.status}
                </span>
                <div className="flex items-center gap-4 justify-end relative w-full">
                  {task.points && (
                    <div
                      className={`px-2 py-1 bg-gray-700/50 rounded-full text-sm transition-all duration-500 transform ${
                        !isCondensedView
                          ? "mr-28"
                          : "group-hover:-translate-x-28"
                      }`}
                    >
                      {task.points} points
                    </div>
                  )}
                  {task.dueDate && (
                    <span
                      className={`absolute right-0 text-gray-500 text-sm transition-all duration-300 transform-all ${
                        !isCondensedView
                          ? "opacity-100 scale-100 translate-x-0"
                          : "opacity-0 scale-95 translate-x-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0"
                      }`}
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Description with smooth expansion */}
              {!isCondensedView && (
                <p className="text-gray-400 mt-2 text-sm transition-opacity duration-500 ease-in-out opacity-100">
                  {task.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>

      {modalOpen && (
        <CreateTaskModal
          userId={user?.id}
          projectId={params.id}
          onClose={() => setModalOpen(false)}
          onTaskCreated={(newTask) => setTasks([...tasks, newTask])}
        />
      )}
    </>
  );
};

export default TaskView;
