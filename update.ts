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
  date: "15 Feb 2025",
  // UPDATE THIS
  title: "Project Template",
  // UPDATE THIS
  content:
    "Hello Manifonians, The hub page is now underway! You'll notice that clicking on the hub button in the pinboard nav bar will take you to a template layout of project creation. Stay tuned for this becoming more functional!",
  // UPDATE THIS
  extra: "",
};
