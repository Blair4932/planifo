"use client";

import { useEffect } from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAndClearStorage } from "./(server)/(utils)/versionCheck";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    checkAndClearStorage();
  }, []);
  return (
    <html lang="en">
      <title>Manifo</title>
      <body className={`antialiased bg-cyan-950`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
