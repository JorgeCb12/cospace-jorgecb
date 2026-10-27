import Link from "next/link";
import { LocalTime } from "@/components/ui/LocalTime";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-20 min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <LocalTime />
      </div>

      <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Encuentra tu espacio ideal en{" "}
        <span className="text-blue-600">CoSpace</span>
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        Reserva escritorios, salas de juntas y cabinas por horas. La plataforma
        definitiva para el trabajo híbrido.
      </p>

      <Link
        href="/spaces"
        className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105"
      >
        Explorar Catálogo
      </Link>
    </div>
  );
}
