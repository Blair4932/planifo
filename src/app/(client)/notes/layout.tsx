export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` text-white bg-yellow-900 h-svh`}>{children}</div>;
}
