export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`bg-gray-900
     h-svh`}
    >
      {children}
    </div>
  );
}
