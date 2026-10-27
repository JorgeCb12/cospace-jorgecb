import { Navbar } from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p>© 2026 CoSpace. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
