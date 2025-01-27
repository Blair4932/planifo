"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegistration = async () => {
    setIsLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      localStorage.setItem("username", username);
      router.push("/login");
    } else {
      setFailed(true);
      setError(data.error);
    }
  };

  return (
    <>
      <div className="text-white flex justify-between items-center h-28 bg-cyan-700">
        <h1 className="text-[45px] font-extralight ml-7">Manifo.uk</h1>
        <h3 className="mr-10 cursor-pointer">
          <a href="mailto:admin@manifo.uk">Report a bug</a>
        </h3>
      </div>

      {/* Container for background and content */}
      <div className="relative text-white flex justify-center items-center min-h-screen bg-cyan-900">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/assets/plan.jpg')",
            objectFit: "cover",
          }}
        ></div>

        {/* Content Area */}
        <div className="relative z-10 text-white flex justify-center items-center w-full h-full">
          {/* Left Side */}
          <div className="flex flex-col items-center justify-center w-[40%] p-8 mb-56">
            <img
              src="/assets/life.png"
              className="h-32 mb-4"
              alt="Manifo Logo"
            />
            <h1 className="text-4xl font-light mb-4">Manifo</h1>
            <p className="text-center font-extralight mb-8">
              Join millions of users today in turning their life into more than
              just a 'what if'.
            </p>
            <div className="flex flex-col gap-6 items-start w-full">
              {/* Icon 1 */}
              <div className="flex items-center gap-4">
                <img src="assets/post-it(1).png" className="h-16" alt="Icon" />
                <div>
                  <span className="text-lg font-semibold">Notes</span>
                  <p className="text-sm">
                    Create and organize your notes easily.
                  </p>
                </div>
              </div>

              {/* Icon 2 */}
              <div className="flex items-center gap-4">
                <img src="assets/cells.png" className="h-16" alt="Icon" />
                <div>
                  <span className="text-lg font-semibold">Tables</span>
                  <p className="text-sm">
                    Manage and organize your data in tables.
                  </p>
                </div>
              </div>

              {/* Icon 3 */}
              <div className="flex items-center gap-4">
                <img
                  src="assets/calendar.png"
                  className="h-16 cursor-pointer"
                  alt="Icon"
                />
                <div>
                  <span className="text-lg font-semibold">Calendar</span>
                  <p className="text-sm">
                    Stay on top of your events and tasks.
                  </p>
                </div>
              </div>

              {/* Icon 4 */}
              <div className="flex items-center gap-4">
                <img
                  src="assets/image.png"
                  className="h-16 cursor-pointer"
                  alt="Icon"
                />
                <div>
                  <span className="text-lg font-semibold">Gallery</span>
                  <p className="text-sm">
                    Store and view your photos in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center items-center w-[50%] p-8">
            <div className="flex flex-col justify-start items-center rounded-md w-[350px]">
              <h2 className="font-light text-[30px] mt-5">Register</h2>
              <p className="text-[15px] font-extralight">
                Type in details below
              </p>
              <input
                className="border-2 border-cyan-600 bg-transparent p-1 rounded-md w-72 mt-4 text-center"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                className="border-2 border-cyan-600 bg-transparent p-1 rounded-md w-72 mt-4 text-center"
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                className="border-2 border-cyan-600 bg-transparent p-1 rounded-md w-72 mt-4 text-center"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {failed && <div className="text-red-500 mt-2">{error}</div>}

              <button
                onClick={handleRegistration}
                className="mt-5 border-2 border-pink-300 text-[20px] w-40 h-10 rounded-md hover:bg-pink-300 transition-all"
              >
                {isLoading ? (
                  <div className="border-t-4 border-white border-solid rounded-full w-7 h-7 animate-spin mx-auto"></div>
                ) : (
                  "Join"
                )}
              </button>

              <p
                className="mb-48 mt-2 text-[12px] cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Already have an account?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">© 2025 Manifo.uk - All rights reserved</p>
          <p className="text-sm">Contact: admin@manifo.uk</p>
        </div>
      </footer>
    </>
  );
}
