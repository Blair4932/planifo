"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
          router.push("/login");
        }, 2000);
      } else {
        setMessage("Failed to update password. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <div className="p-6 border rounded-md shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password?</h2>

        {/* Email Input */}
        {!isEmailSent && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email to receive a reset code.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            />
            <button
              onClick={handlePasswordReset}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mb-4"
            >
              Send Reset Code
            </button>
          </>
        )}

        {/* Code Input */}
        {isEmailSent && !isCodeValid && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the reset code sent to your email.
            </p>
            <input
              type="text"
              placeholder="Enter Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            />
            <button
              onClick={handleCodeSubmit}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mb-4"
            >
              Verify Code
            </button>
          </>
        )}

        {/* New Password Input */}
        {isCodeValid && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter your new password.
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            />
            <button
              onClick={handlePasswordUpdate}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 mb-4"
            >
              Update Password
            </button>
          </>
        )}

        {/* Contact Link */}
        <p className="text-[12px]">
          <a href="mailto:admin@manifo.uk">
            <span className="font-bold text-[14px]">Issue resetting?</span>
            <br />
            Contact us and we will get back to you ASAP.
          </a>
        </p>

        {/* Message Display */}
        {message && <p className="text-sm text-gray-700 mt-3">{message}</p>}
      </div>
    </div>
  );
}
