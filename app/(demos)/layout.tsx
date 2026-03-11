export default function DemoGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="/"
        className="fixed right-4 bottom-4 z-[60] rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-black hover:text-white"
      >
        &larr; All Demos
      </a>
      {children}
    </>
  );
}
