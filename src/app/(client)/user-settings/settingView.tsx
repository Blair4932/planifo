"use client";
import { SettingTab } from "./settingsTabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogout } from "./settingsLogic";

export default function SettingView({
  selectedTab,
}: {
  selectedTab: SettingTab;
}) {
  const [user, setUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setLoading(false);
      } else {
        router.push("/login");
        setError("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username || "");
      setNewEmail(user.email || "");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: newUsername,
          email: newEmail,
          password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error(error);
    }
  };

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
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                onClick={handleSaveChanges}
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        );
      case "Accessibility Settings":
        return (
          <div className="p-4 flex mt-3 flex-col items-center gap-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Coming Soon!</h2>
          </div>
        );
      case "Contact":
        return (
          <div className="p-4 flex mt-3 flex-col items-center gap-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Contact us via email</h2>
            <a href="mailto:admin@manifo.uk">
              <button className="w-64 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">
                Contact Manifo
              </button>
            </a>
          </div>
        );
      case "Logout":
        return (
          <div className="p-4 flex mt-3 flex-col items-center gap-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              Are you sure you want to log out of your Manifo?
            </h2>
            <button
              className="w-64 rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
              onClick={() => handleLogout(router)}
            >
              Logout
            </button>
          </div>
        );
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
