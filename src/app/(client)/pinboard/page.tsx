"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apps } from "../(global-components)/apps";
import WhatsNew from "../(whats-new)/whatsNewCarousel";
import { updateMessage } from "@/update";
import { format } from "date-fns";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [topFiles, setTopFiles] = useState<any>([]);
  const [resume, setResume] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [exampleTasks, setExampleTasks] = useState<any>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const exampleTask = {
      title: "Task Exmple",
      lastUpdatedAt: new Date().toISOString(),
      project: "Project Example",
    };
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push(exampleTask);
    }
    setExampleTasks(items);
  }, []);

  useEffect(() => {
    console.log(updateMessage);
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          await sortContinueWorking(data.user.id);
        } else {
          setError("Failed to get user.");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "DELETE",
    });

    if (res.ok) {
      router.replace("/login");
    } else {
      console.error("Logout failed", await res.json());
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Unknown Date";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const sortContinueWorking = async (userId: string) => {
    setFetchingData(true);
    try {
      const notesResponse = await fetch("/api/get-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });
      const notesData = await notesResponse.json();

      const date = format(new Date(), "yyyy-MM-dd");
      const eventsResponse = await fetch("/api/events/get-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          data: JSON.stringify({ date, userId }),
        },
      });
      const eventsData = await eventsResponse.json();
      setEvents(eventsData.events);

      const notes = Array.isArray(notesData.notes) ? notesData.notes : [];
      const events = Array.isArray(eventsData.events) ? eventsData.events : [];

      let continueWorking = [...notes];

      if (continueWorking.length > 0) {
        continueWorking.sort((a, b) => {
          const dateA = a?.lastUpdatedAt
            ? new Date(a.lastUpdatedAt)
            : new Date(0);
          const dateB = b?.lastUpdatedAt
            ? new Date(b.lastUpdatedAt)
            : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      }

      const maxItems = 12;
      continueWorking = continueWorking.slice(0, maxItems);

      setTopFiles(continueWorking.slice(0, 3));
      setResume(continueWorking.slice(3));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setFetchingData(false);
    }
  };

  const handleClick = (id: string, type: string) => {
    if (type === "event") {
      router.push("/calendar");
      return;
    }
    if (type === "note") {
      router.push(`/editor/${id}`);
    } else {
      router.push(`/tables/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {user ? (
        <div>
          {/* Header */}
          <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center h-28 px-14">
              <h1 className="text-4xl font-extralight">
                Hey, <span className="text-teal-400">{user.username}</span>!
              </h1>
              <div className="flex items-center gap-4 w-[20%]">
                <div className="p-5 w-full">
                  <a
                    href="mailto:admin@manifo.uk"
                    className="text-gray-300 hover:text-teal-400 transition-colors w-10"
                  >
                    Report a bug
                  </a>
                </div>
                {/* Logout Button */}
                <motion.button
                  className="w-full p-2 rounded-md text-white hover:text-red-800 transition-colors"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </header>
          {/* App Nav Bar */}
          <div className="flex justify-between gap-20 w-[85%] ml-24 relative top-32">
            {Object.values(apps).map((app, index) => (
              <div
                key={index}
                className="flex gap-2 justify-center px-10 py-2 items-center cursor-pointer relative group"
                onClick={() => router.push(app.route)}
              >
                <img
                  src={app.iconFilepath}
                  alt={app.route.replace("/", "")}
                  className="h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <p className="text-gray-400 underline hover:text-teal-300 transition-colors">
                  {app.name}
                </p>
              </div>
            ))}
          </div>

          {/* Main Page */}
          <div className="flex relative justify-between top-44 px-32">
            {/* Left Side */}
            <div className="flex flex-col items-start justify-start w-[600px]">
              {/* Top Files */}
              <div className="flex flex-col gap-4 w-full">
                {topFiles.length === 0 ? (
                  <div className="w-[600px] border-2 border-dashed border-gray-600 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center justify-center">
                    <p className="text-gray-400 text-center">
                      No files or projects found.{" "}
                      <span
                        className="text-teal-400 cursor-pointer hover:underline"
                        onClick={() => router.push("/editor")}
                      >
                        Create one now!
                      </span>
                    </p>
                  </div>
                ) : (
                  topFiles.map((item, index) => {
                    const lastUpdatedAt = item.lastUpdatedAt
                      ? formatDate(item.lastUpdatedAt)
                      : "Unknown Date";

                    return (
                      <div
                        key={index}
                        className={`w-[600px] border-yellow-500 border-2 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-100 p-4 rounded-xl shadow-lg cursor-pointer flex items-center`}
                        onClick={() => handleClick(item.id, "note")}
                      >
                        <img
                          src="assets/post-it(1).png"
                          alt="Editor Icon"
                          className="w-9 h-9 mr-4"
                        />
                        <p className="text-left font-bold">
                          {item.title},{" "}
                          <span className="text-sm text-gray-400">
                            {lastUpdatedAt}
                          </span>
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Tasks List */}
              <div className=" mt-10 grid grid-cols-2 ml-4 gap-5 gap-x-6">
                {exampleTasks.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col border border-cyan-300 w-[270px] rounded-md p-3"
                  >
                    <div className="flex flex-row justify-between items-center space-x-2">
                      <p className="text-left font-bold text-[18px]">
                        {item.title}
                      </p>
                      <div className="flex gap-1 items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="text-sm text-gray-500">High</p>{" "}
                      </div>
                    </div>

                    <br />
                    <p className="text-left text-gray-400 text-[14px]">
                      {item.project}
                    </p>
                    <br />
                    <p className="text-left text-gray-400 text-[10px]">
                      {item.lastUpdatedAt}{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Side */}
            <WhatsNew events={events} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
