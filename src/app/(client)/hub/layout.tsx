export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="h-full overflow-scroll">{children}</div>
    </div>
  );
}
