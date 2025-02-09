import { SettingTab } from "./settingsTabs";
import { MouseEventHandler } from "react";

export const handleTabSelect = (
  tab: SettingTab
): MouseEventHandler<HTMLLIElement> => {
  return;
};

export const fetchUser = async () => {};

export const handleLogout = async (router: any) => {
  const res = await fetch("/api/logout", { method: "DELETE" });

  if (res.ok) {
    localStorage.clear();
    window.location.reload();
  } else {
    console.error("Logout failed", await res.json());
  }
};
