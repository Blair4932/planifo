"use client";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Notes() {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const createNote = () => {
    alert("note");
  };

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

  return <button onClick={createNote}>+</button>;
}
