"use client";
import { useState } from "react";
import { settingsTabs, SettingTab } from "./settingsTabs";
import { motion } from "framer-motion";

export const SideBar = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: SettingTab;
  setSelectedTab: (tab: SettingTab) => void;
}) => {
  const [searchSetting, setSearchSetting] = useState("");

  return (
    <div className="w-full lg:w-1/4 bg-gray-800 p-6 border-r border-gray-700">
      <h3 className="text-1xl mb-6 text-yellow-400">
        <input
          type="text"
          value={searchSetting}
          onChange={(e) => setSearchSetting(e.target.value)}
          placeholder="Search"
          className="w-full border text-black border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
        />
      </h3>
      <ul className="flex justify-around flex-col gap-5">
        {settingsTabs.map((tab) => (
          <motion.li
            className={` p-3 text-xl bg-[#2d3a4d] rounded-md cursor-pointer ${
              selectedTab.id === tab.id
                ? "outline-blue-500 outline"
                : "outline-transparent"
            }`}
            whileHover={{ scale: 1.03 }}
            key={tab.id}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.name}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
