"use client";
import placeholderProject from "./placeholder";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./(components)/Button";
import Label from "./(components)/Label";
import { colourVars } from "./(variables)/colourVars";
import ProjectCard from "./(components)/ProjectCard";
import CreateProjectModal from "./(components)/CreateProjectModal";

export default function Hub() {
  const [projects, setProjects] = useState([placeholderProject]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setLoading(false);
      } else {
        router.replace("/login");
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center h-28 px-32">
          <h1 className="text-4xl font-extralight">
            Project <span className="text-teal-400">Hub</span>
          </h1>
          <div className="flex items-center w-[15%]">
            {/* Logout Button */}
            <button
              className="w-full p-2 rounded-md text-white hover:text-purple-300 transition-colors"
              onClick={() => router.push("/pinboard")}
            >
              Return to pinboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col ml-44 justify-center items-center top-28 relative h-full w-[77%]">
        {/* Label & Button Container */}
        <div className="flex justify-between mt-10 w-[97%]">
          <Label children={"Active"} color={colourVars.hubGreen}></Label>
          <Button
            onClick={() => setModalOpen(true)}
            children={"Create Project"}
            color={colourVars.hubPurple}
          ></Button>
        </div>

        {/* Project Cards */}
        <div>
          <ProjectCard project={projects[0]}></ProjectCard>
        </div>
      </div>
      {modalOpen && <CreateProjectModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
