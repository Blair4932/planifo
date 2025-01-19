"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [signupStarted, setSignupStarted] = useState(false);
  const router = useRouter();

  const handleRegistration = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("username", username);
      router.push("/login");
    } else {
      setFailed(true);
      setError(data.error);
    }
  };

  const handleStartSignup = () => {
    setSignupStarted(true);
  };

  return (
    <>
      {!signupStarted ? (
        <div className=" text-white flex items-center justify-center h-svh">
          <div className="flex flex-col justify-center items-center">
            <img src="/assets/life.png" className="h-64" />
            <h1 className="font-light text-[40px]">Welcome to LifeLine</h1>
            <p className="font-light text-center text-[20px]">
              Join millions of users today in turning their life into more than
              just a 'what if'
            </p>
            <p className="font-extralight text-center mt-3">
              Whether it's getting your life back on track to meet your goals,
              or keeping that <br />
              streak alive, your personal LifeLine account is here to help!
            </p>
            <div className="flex items-center justify-center mt-3 mb-48 gap-3">
              <button
                onClick={handleStartSignup}
                className="border-2 border-pink-400 text-[20px] w-40 h-10 rounded-md bg-pink-400 transition-all"
              >
                Join
              </button>
              <button
                onClick={() => router.push("/login")}
                className="border-2 border-pink-500 text-[20px] w-40 h-10 rounded-md hover:bg-pink-500 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className=" text-white flex items-center justify-center h-svh w-svw">
          <div className="flex gap-80">
            <div className="flex flex-col justify-center items-center">
              <img src="/assets/edit.png" className="h-80 ml-28" />
              <h1 className="font-light text-[40px]">Let's get started!</h1>
              <p>
                Fill in the details in the signup panel to hop on your LifeLine
              </p>
            </div>
            <div className="flex flex-col justify-start items-center rounded-md w-[350px] h-[400px]">
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
              ></input>
              <input
                className="border-2 border-cyan-600 bg-transparent p-1 rounded-md w-72 mt-4 text-center"
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              ></input>
              <input
                className="border-2 border-cyan-600 bg-transparent p-1 rounded-md w-72 mt-4 text-center"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></input>
              {failed && <div className="text-red-500 mt-2">{error}</div>}
              <button
                onClick={handleRegistration}
                className="mt-5 border-2 border-pink-300 text-[20px] w-40 h-10 rounded-md hover:bg-pink-300 transition-all"
              >
                Join
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
      )}
    </>
  );
}
