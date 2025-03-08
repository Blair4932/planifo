"use client"; // Ensures this component runs on the client

import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleViewMode, {
  ViewMode,
} from "../app/(client)/(global-functions)/viewMode";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>({
    dark: true,
    header: "#1F1F2A",
    primary: "#98A6B0",
    highlight: "#70818D",
    secondary: "#5AD8CC",
    background: "#002F4F",
    darkBackground: "#031D2E",
    note: "#D9D9D9",
    project: "#757575",
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchViewMode = async () => {
      const updatedViewMode = await handleViewMode();
      setViewMode(updatedViewMode);
    };

    fetchViewMode();
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-screen" />;
  }

  return (
    <div
      style={{
        background: `linear-gradient(${viewMode.background}, ${viewMode.darkBackground})`,
      }}
      className="min-h-screen"
    >
      <PrimeReactProvider value={{ ripple: true }}>
        {children}
      </PrimeReactProvider>
      <ToastContainer />
    </div>
  );
}
