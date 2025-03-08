import { SettingTab } from "./settingsTabs";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";

export const handleTabSelect = (
  tab: SettingTab
): MouseEventHandler<HTMLLIElement> => {
  return;
};

export const fetchUser = async () => {};

export const handleLogout = async () => {
  const router = useRouter();
  const res = await fetch("/api/logout", { method: "DELETE" });
  if (res.ok) {
    router.replace("/login");
  } else {
    console.error("Logout failed", await res.json());
  }
};
