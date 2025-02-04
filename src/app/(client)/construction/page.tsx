"use client";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-6">Under Construction</h1>
      <p className="text-xl font-light mb-6">
        Sorry, this page is not available yet. I'm still working on it!
      </p>
      <p className="text-md mb-6">Please check back later.</p>
      <Link
        href="/pinboard"
        className="text-lg text-blue-500 hover:underline transition-all"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
