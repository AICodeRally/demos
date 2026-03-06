export default function DemoGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="/"
        className="fixed left-4 top-4 z-[60] rounded-full bg-black/80 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black"
      >
        &larr; All Demos
      </a>
      {children}
    </>
  );
}
