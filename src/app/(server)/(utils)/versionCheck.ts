import { version } from "@/package.json";

export function checkAndClearStorage() {
  if (typeof window !== "undefined") {
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== version) {
      localStorage.setItem("appVersion", version);
    }
  }
}
