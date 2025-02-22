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
      className="w-[1255px] overflow-hidden bg-gray-50 bg-opacity-[3%] h-[250px] p-10 border rounded-md mt-10 flex justify-between hover:scale-[101%] transition-all hover:shadow-lg select-none"
      style={{ borderColor: colourVars.hubPurple, transitionDuration: "0.2s" }}
    >
      <Ripple
        pt={{
          root: {
            style: {
              background: "rgba(255, 255, 2556, 0.1)",
              animationDuration: "1s",
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
        <p className="mt-5 text-[14px] text-gray-400">{project.description}</p>
        <div className="mt-12 text-gray-400 flex">
          <h1 className="text-[14px]">Total Tasks: {project.tasks.length}</h1>
          <h1 className="text-[14px] ml-4">
            Created: {project.createdAt.toLocaleDateString()}
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
        <div className="flex flex-col">
          <h2 className="text-2xl">
            {" "}
            Sprint:{" "}
            <span style={{ color: colourVars.hubGreen }}>
              {" "}
              {project.sprints[0].status}
            </span>
          </h2>
          <div className="text-gray-400 mt-1 text-[14px]">
            {project.sprints[0].startDate.toLocaleDateString()} -{" "}
            {project.sprints[0].endDate.toLocaleDateString()}
          </div>
          <div className="flex flex-col mt-4 text-[14px] text-gray-300">
            <p>Tasks Completed: 1</p>
            <p>Total Tasks in sprint: 2</p>
            <p>Total sprint Points: 16</p>
          </div>
          <div className="mt-4">
            <p className="text-[14px] text-gray-400">
              Recently Completed: <br />
              {project.sprints[0].tasks[0].title}
            </p>
          </div>
        </div>
        <div className=" ml-24 flex items-center justify-center">
          <CircularProgress
            current={1}
            target={project.sprints[0].tasks.length}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
