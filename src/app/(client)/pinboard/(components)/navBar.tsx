"use client";
import { apps } from "../../(global-components)/apps";
import { useRouter } from "next/navigation";
import { handleLogout } from "../../(global-functions)/logout";
import { ViewMode } from "../../(global-functions)/viewMode";

interface NavBarProps {
  viewMode: ViewMode;
  username: string;
}

export default function NavBar({ viewMode, username }: NavBarProps) {
  const router = useRouter();
  return (
    <aside className="hidden md:flex flex-col mt-10 min-w-[15%] max-w-[15%] text-xl gap-3 text-gray-100 cursor-default">
      {Object.values(apps).map((app, index) => (
        <div
          key={index}
          style={{ backgroundColor: viewMode.primary }}
          className={`p-2 z-10 rounded-lg hover:scale-105 transition-all duration-75`}
          onClick={() => router.push(app.route)}
        >
          {app.name}
        </div>
      ))}
      <div
        className="mt-10 text-lg flex justify-around flex-wrap"
        style={{ color: viewMode.primary }}
      >
        <div
          className="cursor-pointer hover:text-gray-500"
          onClick={handleLogout}
        >
          Logout
        </div>
        <div className="cursor-pointer hover:text-gray-500">
          <a
            href={`mailto:admin@planifo.com?subject=Bug%20report%20- ${username}%20${new Date().toLocaleDateString()}%20`}
          >
            Contact
          </a>
        </div>
        <div
          className="mt-2 cursor-pointer hover:text-gray-500"
          onClick={() => router.push("/whats-new")}
        >
          What's New?
        </div>
      </div>
    </aside>
  );
}
