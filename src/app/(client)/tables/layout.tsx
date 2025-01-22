export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={` bg-cyan-700 h-svh`}>{children}</div>;
}
