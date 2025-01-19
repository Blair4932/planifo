export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`bg-cyan-800 h-svh`}>{children}</div>;
}
