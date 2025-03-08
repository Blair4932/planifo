"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./(components)/Button";
import Label from "./(components)/Label";
import ProjectCard from "./(components)/ProjectCard";
import CreateProjectModal from "./(components)/CreateProjectModal";
import { fetchProjects } from "./(logic)/projectAPI";
import { LoadingSpinner } from "../(global-components)/loadingSpinner";
import handleViewMode, { ViewMode } from "../(global-functions)/viewMode";
import Header from "../pinboard/(components)/header";

export default function Hub() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>({
    dark: true,
    header: "#1F1F2A",
    primary: "#98A6B0",
    highlight: "#70818D",
    secondary: "#5AD8CC",
    background: "#002F4F",
    darkBackground: "#031D2E",
    note: "#D9D9D9",
    project: "#757575",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          const newView = await handleViewMode();
          console.log(newView);
          setViewMode(newView);
          setProjects(await fetchProjects(data.user.id));
        } else {
          setError("Failed to fetch user");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error fetching user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: viewMode.darkBackground }}
      >
        <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Header
        viewMode={viewMode}
        first={"Project"}
        second={"Hub"}
        nav={{ name: "Return Home", route: "/pinboard" }}
      />

      {/* Main Content */}
      <div
        className="flex text-white flex-col justify-center items-center w-full"
        style={{ backgroundColor: viewMode.background }}
      >
        {/* Centered Container with w-[65%] */}
        <div className="w-[65%] flex">
          <div className="w-full flex flex-col h-full">
            {/* Label & Button Container */}
            <div className="flex justify-between mt-10 w-full flex-col md:flex-row gap-4 md:gap-0">
              <Label children={"Active"} color={viewMode.secondary} />
              <Button
                onClick={() => setModalOpen(true)}
                children={"Create Project"}
                color={viewMode.highlight}
              />
            </div>

            {/* Scrollable Project List */}
            <div className="mt-5 w-full overflow-y-auto">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    project={project}
                    viewMode={viewMode}
                  />
                ))
              ) : (
                <div
                  className="w-full flex flex-col items-center justify-center p-6 border border-dashed rounded-lg"
                  style={{ borderColor: viewMode.primary }}
                >
                  <p className="text-gray-500 text-lg mb-4">
                    No projects found.
                  </p>
                  <button
                    className="px-4 py-2 underline text-blue-500 rounded-lg transition-colors"
                    onClick={() => setModalOpen(true)}
                  >
                    Create a New Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CreateProjectModal
          userId={user.id}
          setProjects={setProjects}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
