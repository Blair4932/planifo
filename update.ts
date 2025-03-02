import { APP_VERSION } from "./version";

interface UpdateMessage {
  version: string;
  date: string;
  title: string;
  content: string;
  extra: string;
}

// This should be changed on each commit
export const updateMessage: UpdateMessage = {
  version: APP_VERSION,
  // UPDATE THIS
  date: "2 Mar 2025",
  // UPDATE THIS
  title: "TASKS, TASKS AND MORE TASKS",
  // UPDATE THIS
  content:
    "Hello Planifonians, The first large wave of the Project Hub is released. This introduces Tasks and the ability to keep track of your projects more clearly. The next addition will be milestones. Keep an eye out!",
  // UPDATE THIS
  extra: "",
};
