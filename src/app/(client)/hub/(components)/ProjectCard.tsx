import React from "react";
import { useRouter } from "next/navigation";
import { Ripple } from "primereact/ripple";
import CircularProgress from "./CardChart";

interface ProjectCardProps {
  project: any;
  viewMode: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/hub/${project.id}`)}
      className="w-full bg-opacity-[3%] p-6 border rounded-md mt-6 flex flex-col hover:scale-[100%] hover:bg-slate-700 transition-all hover:shadow-lg select-none"
      style={{
        borderColor: viewMode.highlight,
        transitionDuration: "0.2s",
        backgroundColor: viewMode.darkBackground,
      }}
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
      <div className="w-full flex-col flex">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl md:text-3xl">{project.icon}</h1>
          <h1 className="text-2xl md:text-3xl font-extralight">
            {project.title}
          </h1>
        </div>
        <p
          className="mt-5 w-full text-[12px] md:text-[14px]"
          style={{ color: viewMode.highlight }}
        >
          {project.description}
        </p>
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-2 md:gap-4">
          <h1
            className="text-[12px] md:text-[14px]"
            style={{ color: viewMode.highlight }}
          >
            Total Tasks: {project.tasks?.length || 0}
          </h1>
          <h1
            className="text-[12px] md:text-[14px]"
            style={{ color: viewMode.highlight }}
          >
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </h1>
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-[1.5px] my-4"
        style={{ backgroundColor: viewMode.highlight }}
      ></div>

      {/* Right Side */}
      <div className="w-full flex flex-col">
        {project.sprints && project.sprints.length > 0 ? (
          // If there are sprints, show sprint information
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl">
              Sprint:{" "}
              <span style={{ color: viewMode.secondary }}>
                {project.sprints[0].status}
              </span>
            </h2>
            <div
              className="mt-1 text-[12px] md:text-[14px]"
              style={{ color: viewMode.highlight }}
            >
              {new Date(project.sprints[0].startDate).toLocaleDateString()} -{" "}
              {new Date(project.sprints[0].endDate).toLocaleDateString()}
            </div>
            <div
              className="flex flex-col mt-4 text-[12px] md:text-[14px]"
              style={{ color: viewMode.highlight }}
            >
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
              <p
                className="text-[12px] md:text-[14px]"
                style={{ color: viewMode.highlight }}
              >
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
            <h2 className="text-xl md:text-2xl">No Active Sprint</h2>
            <p
              className="mt-1 text-[12px] md:text-[14px]"
              style={{ color: viewMode.highlight }}
            >
              Create a sprint to start tracking progress
            </p>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center">
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
