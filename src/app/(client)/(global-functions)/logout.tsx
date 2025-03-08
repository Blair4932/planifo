"use client";
import { useRouter } from "next/navigation";

export const handleLogout = async (router: any) => {
  const res = await fetch("/api/logout", { method: "DELETE" });
  if (res.ok) {
    router.replace("/login");
  } else {
    console.error("Logout failed", await res.json());
  }
};
