"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./(components)/header";
import handleViewMode, { ViewMode } from "../(global-functions)/viewMode";
import NavBar from "./(components)/navBar";
import BackgroundIcons from "./(components)/backgroundIcons";
import Dashboard from "./(components)/dashboard";

export default function Pinboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          setError("Failed to get user.");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Header
        viewMode={viewMode}
        first={"Hey,"}
        second={user.username}
        nav={""}
      />
      <BackgroundIcons />
      <div className="flex flex-col md:flex-row md:justify-center min-h-screen">
        <section className="w-full md:w-[65%] flex ">
          <NavBar viewMode={viewMode} username={user.username} />
          <Dashboard user={user} />
        </section>
      </div>
    </>
  );
}
