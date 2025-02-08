"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAndClearStorage } from "./(server)/(utils)/versionCheck";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
    checkAndClearStorage();
  }, [router]);

  return null;
}
