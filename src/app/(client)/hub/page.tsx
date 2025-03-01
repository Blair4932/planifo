"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./(components)/Button";
import Label from "./(components)/Label";
import { colourVars } from "./(variables)/colourVars";
import ProjectCard from "./(components)/ProjectCard";
import CreateProjectModal from "./(components)/CreateProjectModal";
import { fetchProjects } from "./(logic)/projectAPI";
import { LoadingSpinner } from "../(global-components)/loadingSpinner";

export default function Hub() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        console.log(await fetchProjects(data.user.id));
        setProjects(await fetchProjects(data.user.id));
        setLoading(false);
      } else {
        router.replace("/login");
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center h-28 px-40 max-w-[1600px]">
          <h1 className="text-4xl font-extralight">
            Project <span className="text-teal-400">Hub</span>
          </h1>
          <div className="flex items-center w-[15%]">
            {/* Return Button */}
            <button
              className="w-full text-right rounded-md text-white hover:text-purple-300 transition-colors"
              onClick={() => router.push("/pinboard")}
            >
              Return to pinboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center relative top-28 w-full h-[calc(100vh-7rem)]">
        <div className="container mx-auto max-w-[1600px] px-40 flex flex-col h-full">
          {/* Label & Button Container */}
          <div className="flex justify-between mt-10 w-full">
            <Label children={"Active"} color={colourVars.hubGreen}></Label>
            <Button
              onClick={() => setModalOpen(true)}
              children={"Create Project"}
              color={colourVars.hubPurple}
            ></Button>
          </div>

          {/* Scrollable Project List */}
          <div className="mt-5 w-full flex-grow overflow-y-auto">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))
            ) : (
              <div className="w-[80%] flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-lg mb-4">No projects found.</p>
                <button
                  className="px-4 py-2 underline text-blue-500 rounded-lg transition-colors"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  Create a New Project
                </button>
              </div>
            )}
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
