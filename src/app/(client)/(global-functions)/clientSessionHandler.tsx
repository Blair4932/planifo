"use client";

import { useRouter } from "next/navigation";

export const handleLogout = async () => {
  const res = await fetch("/api/logout", {
    method: "DELETE",
  });

  if (res.ok) {
    const router = useRouter();
    router.replace("/login");
  } else {
    console.error("Logout failed", await res.json());
  }
};
