"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apps } from "../(global-components)/apps";
import { format } from "date-fns";
import WhatsNew from "../(global-components)/updatemessage";
import { APP_VERSION } from "@/version";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [resume, setResume] = useState<any>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isBannerDismissed = localStorage.getItem("dismissWhatsNewBanner");
    if (isBannerDismissed === "true") {
      setShowWhatsNew(false);
    }
  }, []);

  const dismissBanner = () => {
    setShowWhatsNew(false);
    localStorage.setItem("dismissWhatsNewBanner", "true");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          sortContinueWorking(data.user.id);
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
      localStorage.clear();
    } else {
      console.error("Logout failed", await res.json());
    }
  };

  const sortContinueWorking = async (userId: string) => {
    setIsFetchingData(true);
    try {
      const notesResponse = await fetch("/api/get-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });
      const notesData = await notesResponse.json();

      const tablesResponse = await fetch("/api/get-tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });
      const tablesData = await tablesResponse.json();

      const date = format(new Date(), "yyyy-MM-dd");
      const eventsResponse = await fetch("/api/events/get-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          data: JSON.stringify({ date, userId }),
        },
      });
      const eventsData = await eventsResponse.json();

      let continueWorking = notesData.notes.concat(tablesData.tables);

      continueWorking.sort((a, b) => {
        return (
          new Date(b.lastUpdatedAt).getTime() -
          new Date(a.lastUpdatedAt).getTime()
        );
      });

      continueWorking = continueWorking.slice(0, 18);

      const mergedData = [...eventsData.events, ...continueWorking];

      const rows = [];
      for (let i = 0; i < mergedData.length; i += 5) {
        rows.push(mergedData.slice(i, i + 5));
      }

      setResume(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleClick = (id: string, type: string) => {
    if (type === "event") {
      router.push("/calendar");
      return;
    }
    if (type === "note") {
      router.push(`/notes/${id}`);
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
          <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50 top-0">
            <div className="container mx-auto flex justify-between items-center h-28 px-6">
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  Logout
                </motion.button>
              </div>
            </div>
            <div className="container mx-auto px-6">
              <p
                className="text-sm text-gray-400 hover:text-teal-400 cursor-pointer inline-block"
                onClick={() => router.push("/whats-new")}
              >
                Version {APP_VERSION}
              </p>
            </div>
          </header>

          {/* What's New Banner */}
          {showWhatsNew && (
            <WhatsNew dismiss={!showWhatsNew} onDismiss={dismissBanner} />
          )}

          {/* Main Content */}
          <main className={`pt-28 ${showWhatsNew ? "mt-12" : ""}`}>
            {/* Apps Grid */}
            <div className="container mx-auto px-6 py-8">
              <h2 className="text-3xl font-light mb-11 mt-6">Pinboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-7 px-24 gap-3">
                {Object.values(apps).map((app, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col justify-center items-center cursor-pointer relative"
                    onClick={() => router.push(app.route)}
                  >
                    {/* App Image */}
                    <img
                      src={app.iconFilepath}
                      alt={app.route.replace("/", "")}
                      className="h-32 opacity-80 hover:opacity-100 transition-opacity z-10"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Continue Working Section */}
            <div className="container mx-auto px-6 py-12">
              <h2 className="text-3xl font-light mb-8">Continue Working</h2>
              <div className="space-y-6">
                {isFetchingData ? (
                  <div className="flex justify-center">
                    <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  resume.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
                    >
                      {row.map((item, index) => {
                        const type =
                          "content" in item
                            ? "note"
                            : "date" in item
                              ? "event"
                              : "table";

                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleClick(item.id, type)}
                            className={`flex items-center p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-100 
                ${type === "note" ? "border-yellow-500" : type === "event" ? "border-red-600" : "border-blue-500"} 
                border-2 bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50`}
                          >
                            <img
                              src={
                                type === "note"
                                  ? "assets/post-it(1).png"
                                  : type === "event"
                                    ? "assets/calendar.png"
                                    : "assets/cells.png"
                              }
                              alt={
                                type === "note"
                                  ? "Note"
                                  : type === "event"
                                    ? "Event"
                                    : "Table"
                              }
                              className="w-12 h-12 mr-4"
                            />
                            <div className="flex flex-col justify-start w-full">
                              <h3 className="text-lg font-semibold">
                                {item.title}
                              </h3>
                              {type !== "event" ? (
                                <p className="text-sm text-gray-400">
                                  {new Intl.DateTimeFormat("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).format(new Date(item.lastUpdatedAt))}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">
                                  Today at {item.startTime}
                                </p>
                              )}
                              {type !== "note" && item.content && (
                                <p className="text-sm text-gray-300 mt-2">
                                  {item.content.slice(0, 25)}...
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
