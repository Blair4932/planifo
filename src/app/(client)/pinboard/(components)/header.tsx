import { useState } from "react";
import { apps } from "../../(global-components)/apps";
import { useRouter } from "next/navigation";
import { handleLogout } from "../../(global-functions)/logout";

interface HeaderProps {
  user: any;
  viewMode: any;
}

export default function Header({ user, viewMode }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <header
      style={{ backgroundColor: viewMode.header }}
      className="w-full h-24 flex justify-between items-center px-4 md:justify-center"
    >
      <div className="text-4xl h-24 w-auto md:w-[65%] text-left items-center flex cursor-default text-white">
        <span>Hey,</span>
        <span className="ml-2" style={{ color: viewMode.secondary }}>
          {user.username}
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: viewMode.primary }}
        className="md:hidden p-2 px-3 text-2xl rounded text-white"
      >
        ☰
      </button>

      {/* Mobile Nav Bar */}
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-lg text-white flex flex-col items-center justify-center z-50">
          {/* Mobile Nav Apps */}
          <nav className="flex flex-col gap-4 text-2xl">
            <div
              className="p-4  bg-red-400 rounded-lg hover:scale-105 transition-all duration-75 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Close
            </div>
            {Object.values(apps).map((app, index) => (
              <div
                key={index}
                style={{ backgroundColor: viewMode.primary }}
                className="p-4 rounded-lg hover:scale-105 transition-all duration-75 cursor-pointer"
                onClick={() => {
                  router.push(app.route);
                  setIsOpen(false);
                }}
              >
                {app.name}
              </div>
            ))}
          </nav>

          {/* Logout and Contact */}
          <div className="mt-10 text-lg flex flex-col items-center gap-4">
            <div
              className="cursor-pointer hover:text-gray-500"
              onClick={() => {
                setIsOpen(false);
                handleLogout(router);
              }}
            >
              Logout
            </div>
            <div className="cursor-pointer hover:text-gray-500">Contact</div>
          </div>
        </div>
      )}
    </header>
  );
}
