import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Catálogo de Espacios
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col"
          >
            <div className="relative h-48 w-full">
              <Image
                src={space.imageUrl}
                alt={space.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-bold text-gray-900">{space.name}</h2>
              <p className="text-gray-600 mt-2 flex-grow">
                {space.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  ${Number(space.pricePerHour).toFixed(2)} / hora
                </span>
                <Link
                  href={`/spaces/${space.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
