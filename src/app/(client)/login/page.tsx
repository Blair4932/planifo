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
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.user) {
        router.replace("/pinboard");
      } else {
        return;
      }
    };

    fetchUser();
  }, []);

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
      router.push("/pinboard");
    } else {
      setFailed(true);
      setError(data.error || "An unexpected error occurred.");
    }
  };

  const handleForgotPassword = () => {
    router.push("login/forgot-password");
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Login Container */}
      <motion.div
        className="relative z-10 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-[90%] max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl flex items-center font-light text-center flex justify-center mb-6 text-gray-200 font-sans cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => router.push("/register")}
        >
          Your Planifo
          <motion.img
            src="assets/PlanifoLogo.png"
            className="h-20 px-5"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          />
        </motion.h1>

        {/* Username Input */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input
            className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
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
            className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
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
          className="w-full p-2 rounded-md bg-teal-400 text-gray-900 font-semibold hover:bg-teal-500 transition-colors flex items-center justify-center"
          onClick={handleLogin}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {isLoading ? (
            <div className="border-t-4 border-gray-900 border-solid rounded-full w-6 h-6 animate-spin"></div>
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
            className="text-sm text-gray-400 cursor-pointer hover:text-teal-400 transition-colors"
            onClick={() => router.push("/register")}
          >
            Don't have an account?
          </p>
          <p
            className="text-sm text-gray-400 cursor-pointer hover:text-teal-400 transition-colors"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
          <p className="text-[10px] mt-2 text-gray-400 transition-colors">
            Planifo is currently a work in progress. You may experience bugs or
            poor performance. Please support me by using the "Report Bug" option
            if you encounter an issue
          </p>
        </motion.div>
      </motion.div>

      {/* Floating Icons for Quirky Charm */}
      {/* Post-it Editor */}
      <motion.img
        src="/assets/editor.png"
        className="absolute hidden md:block top-10 left-10 h-24 opacity-50"
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
        src="/assets/hub.png"
        className="absolute top-40 left-1/4 h-20 opacity-50"
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
        className="absolute hidden md:block bottom-20 right-10 h-24 opacity-50"
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
        className="absolute bottom-40 right-1/4 h-20 opacity-50"
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
        src="/assets/hub.png"
        className="absolute top-1/4 right-10 h-24 opacity-50"
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
        src="/assets/dashboard.png"
        className="absolute top-1/2 left-10 h-20 opacity-50"
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
        src="/assets/gallery.png"
        className="absolute bottom-10 left-1/4 h-24 opacity-50"
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
        src="/assets/gallery.png"
        className="absolute bottom-[80%] right-1/4 h-20 opacity-50"
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
