import { Navbar } from "@/components/layout/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <main className="grow">{children}</main>
    </div>
  );
}
