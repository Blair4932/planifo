"use client";
import { useState } from "react";
import { settingTabs } from "./settingTabs";

export default function SideBar() {
  const [searchSetting, setSearchSetting] = useState("");

  return (
    <div className="w-full lg:w-1/4 bg-gray-800 p-6 border-r border-gray-700">
      <h3 className="text-1xl mb-6 text-yellow-400">
        <input
          type="text"
          id="title"
          value={searchSetting}
          onChange={(e) => setSearchSetting(e.target.value)}
          placeholder="Search"
          className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />
      </h3>
    </div>
  );
}
