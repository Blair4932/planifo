"use client";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  return (
    <div className="flex-1 p-14 overflow-y-auto">
      <div className="flex justify-between items-center mb-8 h-[10%]">
        <h1 className="text-3xl font-bold text-gray-200 cursor-pointer hover:underline">
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
  );
}
