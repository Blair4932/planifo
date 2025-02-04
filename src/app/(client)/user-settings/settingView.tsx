"use client";
import { SettingTab } from "./settingsTabs";
import { useEffect, useState } from "react";

export default function SettingView({
  selectedTab,
}: {
  selectedTab: SettingTab;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch("/api/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderTabContent = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center mt-10">
          <div className="border-t-4 border-white border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
      );

    switch (selectedTab.name) {
      case "Account Settings":
        return (
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={user?.username || ""}
                  // onChange={handleAccountSettingsChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user?.email || ""}
                  // onChange={handleAccountSettingsChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={""}
                  // onChange={handleAccountSettingsChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case "Accessibility Settings":
        return <div>Accessibility Settings Content</div>;
      case "Contact":
        return <div>Contact Content</div>;
      case "Logout":
        return <div>Logout Content</div>;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <>
      <div className="h-full flex justify-center">
        <div className="w-[90%]">
          <div className="border border-2 border-blue-300 rounded-md h-[90%] border-opacity-30">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
}
