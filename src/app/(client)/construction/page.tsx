"use client";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
        <h1 className="text-5xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-500">
          Under Construction
        </h1>
        <p className="text-xl font-light mb-6 text-center opacity-80">
          Sorry, this page is not available yet. I'm still working on it!
        </p>
        <p className="text-md mb-6 text-center opacity-60">
          Please check back later and keep an eye on @planifo.com on BlueSky for
          updates.
        </p>
        <Link
          href="/pinboard"
          className="mt-6 inline-block text-lg text-teal-300 hover:text-teal-400 font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back to Home
        </Link>
      </div>
      <div className="absolute bottom-4 text-center text-gray-500 opacity-60 text-xs">
        <p>Powered by Planifo</p>
      </div>
    </div>
  );
}
