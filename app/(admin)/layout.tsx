import { Navbar } from "@/components/layout/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="bg-purple-900 text-white text-center py-2 text-sm font-bold tracking-widest">
        PANEL DE ADMINISTRACIÓN
      </div>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
}
