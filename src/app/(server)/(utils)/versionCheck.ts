import { version } from "@/package.json";

export function checkAndClearStorage() {
  if (typeof window !== "undefined") {
    const storedVersion = localStorage.getItem("appVersion");

    if (storedVersion !== version) {
      localStorage.clear();
      localStorage.setItem("appVersion", version);

      console.log("Storage cleared due to new version");
    }
  }
}
