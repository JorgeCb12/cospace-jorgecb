import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      <Link
        href="/spaces"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <span className="mr-2">←</span> Volver al catálogo
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="relative w-full md:w-3/5 h-72 md:h-auto min-h-[400px]">
          <Image
            src={space.imageUrl}
            alt={space.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8 md:p-12 w-full md:w-2/5 flex flex-col justify-between bg-white">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Espacio de Trabajo
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {space.name}
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {space.description}
            </p>

            <div className="border-t border-b border-gray-100 py-6 mb-8">
              <p className="text-3xl font-black text-gray-900">
                ${Number(space.pricePerHour).toFixed(2)}{" "}
                <span className="text-lg text-gray-500 font-medium">
                  / hora
                </span>
              </p>
            </div>
          </div>

          <Link
            href={`/spaces/${space.id}/book`}
            className="block text-center w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
          >
            Reservar Ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
