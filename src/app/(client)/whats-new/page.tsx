"use client";

import { updateMessage } from "@/update";
import { APP_VERSION } from "@/version";
import { useRouter } from "next/navigation";

export default function WhatsNewPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-md shadow-lg fixed w-full z-50 top-0">
        <div className="container mx-auto flex justify-between items-center h-28 px-6">
          <h1
            className="text-4xl font-extralight cursor-pointer"
            onClick={() => router.push("/pinboard")}
          >
            What's New
          </h1>
          <div className="flex items-center gap-4 w-[20%]">
            <div className="p-5 w-full">
              <a
                href="mailto:admin@manifo.uk"
                className="text-gray-300 hover:text-teal-400 transition-colors w-10"
              >
                Report a bug
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28">
        <div className="container mx-auto px-6 py-8">
          {/* Current Version */}
          <p className="text-sm text-gray-400 mb-4">
            Current Version: {APP_VERSION}
          </p>

          {/* Update Message */}
          <div className="bg-gradient-to-br from-gray-800/50 via-gray-700/50 to-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-light mb-4 text-teal-400">
              {updateMessage.title}
            </h2>
            <p className="text-sm text-gray-400 mb-2">
              Version: {updateMessage.version} - {updateMessage.date}
            </p>
            <p className="text-gray-300">{updateMessage.content}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
