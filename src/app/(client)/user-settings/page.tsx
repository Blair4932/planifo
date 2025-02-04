"use client";
import { SideBar } from "./sidebar";
import Header from "./header";
import SettingView from "./settingView";
import jwt_decode from "jwt-decode";
import { SettingTab } from "./settingsTabs";
import { settingsTabs } from "./settingsTabs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Settings() {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SettingTab>(settingsTabs[0]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          setError("Failed to get user.");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
        <SideBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="flex flex-col w-[90%]">
          <Header />
          <SettingView selectedTab={selectedTab} />
        </div>
      </div>
    </>
  );
}
