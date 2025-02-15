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
  title: "New Look and Feel",
  // UPDATE THIS
  content:
    "Hello Manifonians, We have made changes to the UI of Pinboard as you will see. This features a new layout which prepares us for upcoming features. You'll notice that we you have 6 new rectangles. Don't worry. These will soon be replaced with REAL working links to your own data. In this update, we have also added new UI and functionality to notes. This makes notes more powerful, not just a simple place you can write down text and leave it there. Now, you can design whole documents with images, headers, colour and more. I hope you enjoy the update and as always, if you have any issues, please contact me at admin@manifo.uk. Thanks, Blair.",
  // UPDATE THIS
  extra: "",
};
