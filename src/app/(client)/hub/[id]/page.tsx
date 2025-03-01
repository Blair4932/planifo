"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingSpinner } from "../../(global-components)/loadingSpinner";
import TaskView from "./(TaskView)/taskView";
import { projectNavs } from "../(variables)/projectNavs";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isCondensedView, setIsCondensedView] = useState(true);
  const [activeView, setActiveView] = useState("Tasks");

  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    setLoading(true);
    if (!params.id) return;

    const loadData = async () => {
      try {
        const [userRes, projectRes, tasksRes] = await Promise.all([
          fetch("/api/user"),
          fetch(`/api/hub/get-projects/${params.id}`),
          fetch(`/api/hub/tasks/get-tasks?projectId=${params.id}`),
        ]);

        if (!userRes.ok) throw new Error("Failed to fetch user");
        if (!projectRes.ok) throw new Error("Project not found");
        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");

        const [userData, projectData, tasksData] = await Promise.all([
          userRes.json(),
          projectRes.json(),
          tasksRes.json(),
        ]);

        setUser(userData.user);
        setProject(projectData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params?.id]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;
  if (!project)
    return <div className="text-center py-12">Project not found</div>;

  return (
    <div className="text-white h-svh bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center h-28 px-40 max-w-[1600px]">
          <h1 className="text-4xl font-extralight">
            {project.title} <span className="text-teal-400">{activeView}</span>
          </h1>
          <div className="flex items-center gap-6">
            <button
              className="text-white hover:text-purple-300 transition-colors"
              onClick={() => router.push("/hub")}
            >
              Return to Hub
            </button>
          </div>
        </div>
      </header>
      <div className="w-full flex justify-center items-center">
        <div className="w-full mx-0 flex justify-center gap-x-32 relative top-32">
          {projectNavs.map((name, index) => (
            <div
              key={index}
              className="flex gap-2 justify-center px-10 py-2 items-center cursor-pointer relative group"
              onClick={() => {
                setActiveView(name);
              }}
            >
              <p className="text-gray-400 underline hover:text-teal-300 transition-colors">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {activeView == "Tasks" ? (
        <TaskView
          filteredTasks={filteredTasks}
          setModalOpen={setModalOpen}
          modalOpen={modalOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          isCondensedView={isCondensedView}
          setIsCondensedView={setIsCondensedView}
          tasks={tasks}
          setTasks={setTasks}
          user={user}
          params={params}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
