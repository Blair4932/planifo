import { APP_VERSION } from "./version";

interface UpdateMessage {
  version: string;
  date: string;
  title: string;
  content: string;
}

// This should be changed on each commit
export const updateMessage: UpdateMessage = {
  version: APP_VERSION,
  date: "8 Feb 2025",
  title: "Whats New Scooby Doo?",
  content:
    "This new update brings the Whats New section. When a new build is made, this header will appear. Don't worry, you can dismiss it any time. It also adds welcome emails to users.",
};
