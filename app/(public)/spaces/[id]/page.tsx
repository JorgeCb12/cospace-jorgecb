import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const space = await prisma.space.findUnique({
    where: { id },
  });

  if (!space || !space.isActive) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/spaces"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
        >
          <span className="mr-2">←</span> Volver al catálogo
        </Link>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-200">
        <div className="relative w-full lg:w-3/5 h-[350px] lg:h-auto min-h-[400px]">
          <Image
            src={space.imageUrl}
            alt={space.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Disponible
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12 lg:p-16 w-full lg:w-2/5 flex flex-col justify-between bg-white">
          <div>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-blue-100">
              Espacio de Trabajo
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
              {space.name}
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {space.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xl"></span> Wi-Fi Alta Velocidad
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xl"></span> Climatización
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xl"></span> Zona de Café
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xl"></span> Acceso Seguro
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tarifa por hora
                </p>
                <p className="text-4xl font-black text-slate-900">
                  ${Number(space.pricePerHour).toFixed(2)}
                </p>
              </div>
              <span className="text-slate-400 font-medium mb-2">/ hora</span>
            </div>
          </div>

          {session ? (
            <Link
              href={`/spaces/${space.id}/book`}
              className="block text-center w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Reservar Ahora
            </Link>
          ) : (
            <Link
              href="/login"
              className="block text-center w-full bg-slate-900 text-white text-lg font-bold py-4 rounded-xl hover:bg-black shadow-lg shadow-slate-900/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Inicia sesión para reservar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
