"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.push("/pinboard"); // Redirect to pinboard if logged in
    } else {
      router.push("/login"); // Redirect to login if not logged in
    }
  }, [router]);

  return null; // Render nothing while redirecting
}
