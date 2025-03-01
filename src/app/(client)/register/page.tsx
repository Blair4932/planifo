"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { apps } from "../(global-components)/apps";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [email, setEmail] = useState("");
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegistration = async () => {
    setIsLoading(true);
    if (password !== secondPassword) {
      setError("Passwords dont match");
      setFailed(true);
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFailed(true);
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-gray-200 flex justify-between items-center h-28 bg-gray-900 shadow-lg"
      >
        <h1 className="text-[45px] font-extralight ml-7">Planifo</h1>
        <h3 className="mr-10 cursor-pointer hover:text-teal-400 transition-colors">
          <a href="mailto:admin@planifo.com">Report a bug</a>
        </h3>
      </motion.header>

      {/* Main Content */}
      <div className="relative text-gray-200 flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
        ></motion.div>

        {/* Content Area */}
        <div className="relative z-10 text-gray-200 flex justify-center items-center w-full h-full">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-[45%] p-8 mb-56"
          >
            <motion.img
              src="/assets/PlanifoLogo.png"
              className="h-44 mb-4"
              alt="Planifo Logo"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <h1 className="text-4xl font-light mb-4">Planifo</h1>
            <p className="text-center font-extralight mb-8">
              Join millions - not really - of users today in turning their life
              into more than just a 'what if'.
            </p>
            <div className="grid grid-cols-2 gap-6 w-full mt-5">
              {Object.values(apps).map((app, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={app.iconFilepath} className="h-16" alt="Icon" />
                  <div>
                    <span className="text-lg font-semibold text-teal-300">
                      {app.name}
                    </span>
                    <p className="text-sm">{app.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center w-[50%] p-8"
          >
            <div className="flex flex-col h-[500px] justify-start items-center rounded-lg w-[350px] bg-gray-700/50 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="font-light text-[30px] mt-5">Register</h2>
              <p className="text-[15px] font-extralight">
                Type in details below
              </p>
              <motion.input
                className="border-2 border-gray-600 bg-transparent p-2 rounded-md w-72 mt-4 text-center focus:outline-none focus:border-teal-400 transition-colors"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <motion.input
                className="border-2 border-gray-600 bg-transparent p-2 rounded-md w-72 mt-4 text-center focus:outline-none focus:border-teal-400 transition-colors"
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <motion.input
                className="border-2 border-gray-600 bg-transparent p-2 rounded-md w-72 mt-4 text-center focus:outline-none focus:border-teal-400 transition-colors"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <motion.input
                className="border-2 border-gray-600 bg-transparent p-2 rounded-md w-72 mt-4 text-center focus:outline-none focus:border-teal-400 transition-colors"
                type="password"
                placeholder="Re-enter Password"
                value={secondPassword}
                onChange={(e) => setSecondPassword(e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              {failed && (
                <motion.div
                  className="text-red-500 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                onClick={handleRegistration}
                className="mt-5 border-2 border-teal-400 text-[20px] w-40 h-10 rounded-md hover:bg-teal-400 hover:text-gray-900 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <div className="border-t-4 border-white border-solid rounded-full w-7 h-7 animate-spin mx-auto"></div>
                ) : (
                  "Join"
                )}
              </motion.button>

              <motion.p
                className="mb-48 mt-2 text-[12px] cursor-pointer hover:text-teal-400 transition-colors"
                onClick={() => router.push("/login")}
                whileHover={{ scale: 1.05 }}
              >
                Already have an account?
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 text-gray-200 p-4 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm">© 2025 planifo.com - All rights reserved</p>
          <p className="text-sm">Contact: admin@planifo.com</p>
        </div>
      </motion.footer>
    </>
  );
}
