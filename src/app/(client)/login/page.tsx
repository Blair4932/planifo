"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-900 overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/assets/plan.jpg')",
          objectFit: "cover",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Login Container */}
      <motion.div
        className="relative z-10 bg-cyan-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-[90%] max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl font-light text-center mb-6 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Login
        </motion.h1>

        {/* Username Input */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input
            className="w-full p-2 rounded-md bg-transparent border-2 border-cyan-600 text-white placeholder-cyan-300 focus:outline-none focus:border-pink-300 transition-colors"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </motion.div>

        {/* Password Input */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <input
            className="w-full p-2 rounded-md bg-transparent border-2 border-cyan-600 text-white placeholder-cyan-300 focus:outline-none focus:border-pink-300 transition-colors"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>

        {/* Error Message */}
        {failed && (
          <motion.div
            className="text-red-500 text-sm mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Login Button */}
        <motion.button
          className="w-full p-2 rounded-md bg-pink-300 text-cyan-900 font-semibold hover:bg-pink-400 transition-colors flex items-center justify-center"
          onClick={handleLogin}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {isLoading ? (
            <div className="border-t-4 border-cyan-900 border-solid rounded-full w-6 h-6 animate-spin"></div>
          ) : (
            "Login"
          )}
        </motion.button>

        {/* Additional Links */}
        <motion.div
          className="mt-4 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p
            className="text-sm text-cyan-300 cursor-pointer hover:text-pink-300 transition-colors"
            onClick={() => router.push("/register")}
          >
            Don't have an account?
          </p>
          <p
            className="text-sm text-cyan-300 cursor-pointer hover:text-pink-300 transition-colors"
            onClick={() => router.push("/")}
          >
            Forgot password?
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Icons for Quirky Charm */}
      {/* Post-it Notes */}
      <motion.img
        src="/assets/post-it(1).png"
        className="absolute top-10 left-10 h-24 opacity-70"
        alt="Post-it"
        initial={{ y: -20, rotate: -10 }}
        animate={{ y: 0, rotate: 10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/post-it(1).png"
        className="absolute top-40 left-1/4 h-20 opacity-70"
        alt="Post-it"
        initial={{ y: -30, rotate: 5 }}
        animate={{ y: 0, rotate: -5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Calendars */}
      <motion.img
        src="/assets/calendar.png"
        className="absolute bottom-20 right-10 h-24 opacity-70"
        alt="Calendar"
        initial={{ y: 20, rotate: 10 }}
        animate={{ y: 0, rotate: -10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/calendar.png"
        className="absolute bottom-40 right-1/4 h-20 opacity-70"
        alt="Calendar"
        initial={{ y: 30, rotate: -5 }}
        animate={{ y: 0, rotate: 5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Tables */}
      <motion.img
        src="/assets/cells.png"
        className="absolute top-1/4 right-10 h-24 opacity-70"
        alt="Table"
        initial={{ y: -20, rotate: -5 }}
        animate={{ y: 0, rotate: 5 }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/cells.png"
        className="absolute top-1/2 left-10 h-20 opacity-70"
        alt="Table"
        initial={{ y: 20, rotate: 10 }}
        animate={{ y: 0, rotate: -10 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* Gallery Images */}
      <motion.img
        src="/assets/image.png"
        className="absolute bottom-10 left-1/4 h-24 opacity-70"
        alt="Gallery"
        initial={{ y: -20, rotate: -10 }}
        animate={{ y: 0, rotate: 10 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/assets/image.png"
        className="absolute bottom-[80%] right-1/4 h-20 opacity-70"
        alt="Gallery"
        initial={{ y: 30, rotate: 5 }}
        animate={{ y: 0, rotate: -5 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
