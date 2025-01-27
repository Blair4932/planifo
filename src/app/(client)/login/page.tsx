"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      localStorage.removeItem("username");
      localStorage.setItem("authToken", data.token);
      router.push("/pinboard");
    } else {
      setFailed(true);
      setError(data.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-white">
      <h1 className="text-[45px] mt-60">Login</h1>
      <input
        className="text-center border-2 h-10 rounded-md text-black"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="text-center border-2 h-10 rounded-md mt-2 text-black"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {failed && <div className="text-red-500 mt-2">{error}</div>}

      <button
        className="w-40 h-8 text-white bg-blue-600 border-0 p-1 pl-9 pr-9 mt-2 rounded-md"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="border-t-4 border-white border-solid rounded-full w-6 h-6 animate-spin mx-auto"></div>
        ) : (
          "Login"
        )}
      </button>

      <p
        className="font-extralight text-[12px] mt-2 cursor-pointer"
        onClick={() => router.push("/register")}
      >
        Don't have an account?
      </p>
      <p
        className="font-extralight text-[12px] mt-1 cursor-pointer"
        onClick={() => router.push("/")}
      >
        Forgot password?
      </p>
    </div>
  );
}
