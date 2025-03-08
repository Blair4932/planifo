const lightMode = {
  dark: false,
  header: "#1E1E40",
  primary: "#B3B3B3",
  highlight: "#8E8E8E",
  secondary: "#5AD8CC",
  background: "#FFFFFF",
  darkBackground: "#B5B5B5",
  note: "#C6FAF6",
  project: "#DCCCFF",
};

const darkMode = {
  dark: true,
  header: "#1F1F2A",
  primary: "#98A6B0",
  highlight: "#70818D",
  secondary: "#5AD8CC",
  background: "#002F4F",
  darkBackground: "#031D2E",
  note: "#D9D9D9",
  project: "#757575",
};

export interface ViewMode {
  dark: boolean;
  header: string;
  primary: string;
  highlight: string;
  secondary: string;
  background: string;
  darkBackground: string;
  note: string;
  project: string;
}

export default async function handleViewMode(): Promise<ViewMode> {
  const isDarkMode = localStorage.getItem("darkMode");
  if (isDarkMode === "true") {
    return darkMode;
  } else {
    return lightMode;
  }
}
