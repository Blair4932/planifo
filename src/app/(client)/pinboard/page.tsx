"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

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

  /**
   * fetches and sorts the continue working section
   * @param userId
   */
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
        rows.push(continueWorking.slice(i, i + 6));
      }

      setResume(rows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setIsFetchingData(false);
    }
  };

  /**
   * handles clicking an item in continue working to redirect to the file
   * @param id id of the file
   * @param isNote boolean to determine if it is a note (will have to change when events are added)
   */
  const handleClick = (id: string, isNote: boolean) => {
    if (isNote) {
      router.push(`/notes/${id}`);
    } else {
      router.push(`/tables/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
    );
  }

  return (
    <div>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <div className="text-white flex justify-between items-center h-28 bg-cyan-700">
            <h1 className="text-[45px] font-extralight ml-7">
              Hey, {user.username}!
            </h1>
            <h3 className="ml-[68%] cursor-pointer">
              <a href="mailto:admin@manifo.uk">Report a bug</a>
            </h3>
            <div
              className="bg-white rounded-full p-3 mr-7 cursor-pointer"
              onClick={() => router.push("/desk")}
            >
              <img src="/assets/desk.png" className="h-16" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-cyan-900 h-[500px] relative">
            {/* Background Image with low opacity */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('/assets/plan.jpg')" }}
            ></div>

            <div className="flex justify-center items-center gap-28 relative z-10 p-6">
              <img
                src="assets/post-it(1).png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/notes")}
              />
              <img
                src="assets/calendar.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/construction")}
              />
              <img
                src="assets/cells.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/tables")}
              />
              <img
                src="assets/image.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/construction")}
              />
              <img
                src="assets/admin.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/construction")}
              />
            </div>
          </div>

          <h2 className="text-[30px] ml-7 mt-7 text-white">
            Continue Working:
          </h2>

          <div className="text-white flex justify-center items-center">
            <div className="space-y-4 mt-4">
              {/* Render the rows of items */}
              {isFetchingData ? (
                <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin mx-auto"></div>
              ) : (
                resume.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex space-x-4">
                    {row.map((item, index) => {
                      const isNote = "content" in item;
                      return (
                        <div
                          key={index}
                          onClick={() => handleClick(item.id, isNote)}
                          className={`flex items-center p-6 rounded-lg shadow-md cursor-pointer transform transition-all duration-300 
                          ${isNote ? "border-yellow-500" : "border-blue-500"} border-[2px] bg-transparent hover:scale-105 w-[300px]`}
                        >
                          <img
                            src={
                              isNote
                                ? "assets/post-it(1).png"
                                : "assets/cells.png"
                            }
                            alt={isNote ? "Note" : "Table"}
                            className="w-16 h-16 mr-6"
                          />
                          <div>
                            <h3 className="text-xl mb-2">{item.title}</h3>
                            <p className="text-sm mb-3">
                              {new Intl.DateTimeFormat("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(new Date(item.lastUpdatedAt))}
                            </p>
                            {!isNote && item.content && (
                              <p className="text-sm text-gray-300">
                                {item.content.slice(0, 25)}...
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
