"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apps } from "../(global-components)/apps";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [resume, setResume] = useState<any>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setLoading(true);
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
        sortContinueWorking(decoded.id);
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Token is invalid or expired.");
        router.push("/login");
      }
    } else {
      setError("No token found.");
      router.push("/login");
    }

    setLoading(false);
  }, [router]);

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

      let continueWorking = notesData.notes.concat(tablesData.tables);

      continueWorking.sort((a, b) => {
        return (
          new Date(b.lastUpdatedAt).getTime() -
          new Date(a.lastUpdatedAt).getTime()
        );
      });

      continueWorking = continueWorking.slice(0, 18);

      const rows = [];
      for (let i = 0; i < continueWorking.length; i += 6) {
        rows.push(continueWorking.slice(i, i + 5));
      }

      setResume(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleClick = (id: string, isNote: boolean) => {
    if (isNote) {
      router.push(`/notes/${id}`);
    } else {
      router.push(`/tables/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-teal-400 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {user ? (
        <div>
          {/* Header */}
          <header className="bg-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center h-28 px-6">
              <h1 className="text-4xl font-extralight">
                Hey, <span className="text-teal-400">{user.username}</span>!
              </h1>
              <div className="flex items-center gap-6">
                <a
                  href="mailto:admin@manifo.uk"
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  Report a bug
                </a>
                <div
                  className="bg-gray-200 rounded-full p-3 cursor-pointer hover:bg-teal-400 transition-colors"
                  onClick={() => router.push("/desk")}
                >
                  <img src="/assets/desk.png" className="h-12" alt="Desk" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="pt-28">
            {/* Floating Icons Section */}
            <section className="relative h-[500px] flex justify-center items-center">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: "url('/assets/plan.jpg')" }}
              ></div>

              {/* Icons Grid */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-6 gap-8 p-6">
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
            </section>

            {/* Continue Working Section */}
            <section className="container mx-auto px-6 py-12">
              <h2 className="text-3xl font-light mb-8">Continue Working:</h2>
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
                        const isNote = "content" in item;
                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleClick(item.id, isNote)}
                            className={`flex items-center p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300 
                            ${isNote ? "border-yellow-500" : "border-blue-500"} border-2 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50`}
                          >
                            <img
                              src={
                                isNote
                                  ? "assets/post-it(1).png"
                                  : "assets/cells.png"
                              }
                              alt={isNote ? "Note" : "Table"}
                              className="w-12 h-12 mr-4"
                            />
                            <div>
                              <h3 className="text-lg font-semibold">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {new Intl.DateTimeFormat("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }).format(new Date(item.lastUpdatedAt))}
                              </p>
                              {!isNote && item.content && (
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
            </section>
          </main>
        </div>
      ) : (
        <p className="text-center py-12">Loading...</p>
      )}
    </div>
  );
}
