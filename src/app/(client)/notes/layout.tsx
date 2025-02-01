export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` text-white bg-gray-800 h-svh`}>{children}</div>;
}
