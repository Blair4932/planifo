import React from "react";
import { colourVars } from "../(variables)/colourVars";
import { Ripple } from "primereact/ripple";
import CircularProgress from "./CardChart";

interface ProjectCardProps {
  project: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div
      onClick={() => console.log("Clicked")}
      className="w-[1280px] overflow-hidden bg-gray-50 bg-opacity-[3%] h-[250px] p-10 border rounded-md mt-6 flex justify-between hover:scale-[101%] transition-all hover:shadow-lg select-none"
      style={{ borderColor: colourVars.hubPurple, transitionDuration: "0.2s" }}
    >
      <Ripple
        pt={{
          root: {
            style: {
              background: "rgba(255, 255, 2556, 0.1)",
              animationDuration: "0.45s",
            },
          },
        }}
      />
      {/* Left Side */}
      <div className="w-[60%] flex-col flex">
        <div className="flex gap-4 items-center">
          <h1 className="text-3xl">{project.icon}</h1>
          <h1 className="text-3xl font-extralight">{project.title}</h1>
        </div>
        <p className="mt-5 w-[75%] text-[14px] text-gray-400">
          {project.description}
        </p>
        <div className="mt-12 text-gray-400 flex">
          <h1 className="text-[14px]">
            Total Tasks: {project.tasks?.length || 0}
          </h1>
          <h1 className="text-[14px] ml-4">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </h1>
        </div>
      </div>
      {/* Vertical Line */}
      <div
        className="h-[248px] relative bottom-10 w-[1.5px]"
        style={{ backgroundColor: colourVars.hubPurple }}
      ></div>
      {/* Right Side */}
      <div className="w-[40%] ml-5 flex">
        {project.sprints && project.sprints.length > 0 ? (
          // If there are sprints, show sprint information
          <div className="flex flex-col">
            <h2 className="text-2xl">
              Sprint:{" "}
              <span style={{ color: colourVars.hubGreen }}>
                {project.sprints[0].status}
              </span>
            </h2>
            <div className="text-gray-400 mt-1 text-[14px]">
              {new Date(project.sprints[0].startDate).toLocaleDateString()} -{" "}
              {new Date(project.sprints[0].endDate).toLocaleDateString()}
            </div>
            <div className="flex flex-col mt-4 text-[14px] text-gray-300">
              <p>
                Tasks Completed:{" "}
                {project.sprints[0].tasks?.filter(
                  (task) => task.status === "Done"
                ).length || 0}
              </p>
              <p>
                Total Tasks in sprint: {project.sprints[0].tasks?.length || 0}
              </p>
              <p>
                Total sprint Points:{" "}
                {project.sprints[0].tasks?.reduce(
                  (acc, task) => acc + (task.points || 0),
                  0
                ) || 0}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-[14px] text-gray-400">
                Recently Completed: <br />
                {project.sprints[0].tasks?.find(
                  (task) => task.status === "Done"
                )?.title || "No completed tasks"}
              </p>
            </div>
          </div>
        ) : (
          // If no sprints, show placeholder content
          <div className="flex flex-col">
            <h2 className="text-2xl">No Active Sprint</h2>
            <p className="text-gray-400 mt-1 text-[14px]">
              Create a sprint to start tracking progress
            </p>
          </div>
        )}
        <div className="ml-24 flex items-center justify-center">
          {project.sprints ? (
            <CircularProgress
              current={
                project.sprints[0]?.tasks?.filter(
                  (task) => task.status === "Done"
                ).length || 0
              }
              target={project.sprints[0]?.tasks?.length || 1} // Set minimum target to 1 to avoid 0/0
            />
          ) : (
            <CircularProgress current={0} target={1} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
