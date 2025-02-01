"use client";
import SideBar from "./sidebar";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
        <SideBar />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-500 cursor-pointer hover:underline">
              Settings
            </h1>
            <button
              className="text-sm text-blue-400 hover:underline"
              onClick={() => router.push("/pinboard")}
            >
              Back to Pinboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
