"use client";
import { updateMessage } from "@/update";
import { useRouter } from "next/navigation";

export default function WhatsNew({ dismiss, onDismiss }: any) {
  const router = useRouter();
  if (dismiss) {
    return null;
  }

  return (
    <div className="relative top-32 left-0 right-0 z-60 bg-gradient-to-r from-teal-700/80 to-teal-800/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">
                What's New in Update {updateMessage.version}
              </h3>
              <button
                onClick={onDismiss}
                className="p-2 rounded-full hover:bg-teal-900/50 transition-colors ml-4 -mt-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-md text-gray-200 mb-3">
              {updateMessage.title} - {updateMessage.date}
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">
              {updateMessage.content}{" "}
              <span
                className="underline cursor-pointer text-teal-400"
                onClick={() => router.push("/whats-new")}
              >
                Read More
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
