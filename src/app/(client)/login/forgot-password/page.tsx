"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [code, setCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    try {
      const response = await fetch("/api/login/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Reset code sent! Check your email.");
        setIsEmailSent(true);
      } else {
        setMessage("Failed to send reset code. Try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleCodeSubmit = async () => {
    try {
      const response = await fetch("/api/login/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setMessage("Code verified. Please enter your new password.");
        setIsCodeValid(true);
      } else {
        setMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setMessage("Password updated successfully! You can now log in.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage("Failed to update password. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Forgot Password Container */}
      <motion.div
        className="relative z-10 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-[90%] max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl font-light text-center flex justify-center mb-6 text-gray-200 font-sans cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Forgot Password
        </motion.h1>

        {/* Email Input */}
        {!isEmailSent && (
          <>
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-sm text-gray-400 mb-4">
                Enter your email to receive a reset code.
              </p>
              <input
                className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="w-full p-2 rounded-md bg-teal-400 text-gray-900 font-semibold hover:bg-teal-500 transition-colors"
              onClick={handlePasswordReset}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Send Reset Code
            </motion.button>
          </>
        )}

        {/* Code Input */}
        {isEmailSent && !isCodeValid && (
          <>
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-sm text-gray-400 mb-4">
                Enter the reset code sent to your email.
              </p>
              <input
                className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
                type="text"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="w-full p-2 rounded-md bg-teal-400 text-gray-900 font-semibold hover:bg-teal-500 transition-colors"
              onClick={handleCodeSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Verify Code
            </motion.button>
          </>
        )}

        {/* New Password Input */}
        {isCodeValid && (
          <>
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-sm text-gray-400 mb-4">
                Enter your new password.
              </p>
              <input
                className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="w-full p-2 rounded-md bg-transparent border-2 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors mt-4"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>
            <motion.button
              className="w-full p-2 rounded-md bg-teal-400 text-gray-900 font-semibold hover:bg-teal-500 transition-colors"
              onClick={handlePasswordUpdate}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Update Password
            </motion.button>
          </>
        )}

        {/* Contact Link */}
        <motion.div
          className="mt-4 text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p className="text-sm text-gray-400">
            <a
              href="mailto:admin@manifo.uk"
              className="hover:text-teal-400 transition-colors"
            >
              <span className="font-bold">Issue resetting?</span>
              <br />
              Contact us and we will resolve your problem ASAP.
            </a>
          </p>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            className="text-sm text-gray-200 mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
