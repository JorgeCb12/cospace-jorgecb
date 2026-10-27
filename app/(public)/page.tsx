import Link from "next/link";
import { LocalTime } from "@/components/ui/LocalTime";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50">
      <div className="mb-8 animate-fade-in">
        <LocalTime />
      </div>

      <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tighter leading-tight">
        Encuentra tu espacio ideal en <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          CoSpace
        </span>
      </h1>

      <p className="text-xl text-gray-600 max-w-2xl mb-10 font-medium">
        Reserva escritorios, salas de juntas y cabinas por horas. La plataforma
        definitiva para el trabajo híbrido.
      </p>

      <Link
        href="/spaces"
        className="bg-gray-900 text-white text-lg font-bold px-10 py-4 rounded-full shadow-xl hover:bg-black hover:scale-105 transition-all duration-300"
      >
        Explorar Catálogo
      </Link>
    </div>
  );
}
