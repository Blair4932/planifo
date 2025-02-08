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
  title: "New Event Types",
  content:
    "Hello Manifonians. This new update brings basic functionality of two new event types: Reminders and All Day events. Reminder notification functionality will be released soon.",
};
