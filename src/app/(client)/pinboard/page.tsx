"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: any = jwt_decode(token);
        setUser(decoded);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <h1>Hey, {user.username}!</h1>
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center gap-14 mt-24">
              <img
                src="assets/post-it(1).png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                onClick={() => router.push("/notes")}
              />
              <img
                src="assets/calendar.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
              />
              <img
                src="assets/cells.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
              />
              <img
                src="assets/image.png"
                className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
              />
              {user.username === "admin" && (
                <img
                  src="assets/admin.png"
                  className="h-40 transition-transform transform hover:scale-110 cursor-pointer"
                />
              )}
            </div>
            <h1 className="text-[30px] mt-[40px]">Continue Working:</h1>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
