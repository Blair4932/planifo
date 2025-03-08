"use client";
import { useEffect, useState } from "react";

interface dashboardProps {
  user: any;
}

export default function Dashboard({ user }: dashboardProps) {
  return (
    <div className="w-full mt-24 md:mt-10 md:ml-10 h-full md:h-[60%] md:border-2 border-dotted border-gray-400 flex justify-center items-center flex-col text-center">
      <img
        src="/assets/dashboard.png"
        alt="Dashboard Icon"
        width={50}
        height={50}
        className="mt-5 md:mt-0"
      />
      <p className="mt-4 text-xl text-gray-600">
        No dashboard created yet <br />
      </p>
      <a href="/construction" className="text-blue-600 mt-2 hover:underline">
        Create Dashboard
      </a>
    </div>
  );
}
