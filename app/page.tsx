import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Bienvenido a <span className="text-blue-600">FullstackApp</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Esta es la plantilla base definitiva. Autenticación segura,
          validaciones estrictas y arquitectura por capas, lista para cualquier
          prueba de desempeño.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Comenzar ahora
          </Link>
        </div>
      </main>
    </div>
  );
}
