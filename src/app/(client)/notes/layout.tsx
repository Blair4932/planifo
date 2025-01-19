export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` text-white bg-cyan-700 h-svh`}>{children}</div>;
}
