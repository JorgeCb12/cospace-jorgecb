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
    <div className="max-w-7xl mx-auto p-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Catálogo</h1>
        <p className="text-gray-500 text-lg">
          Encuentra el lugar perfecto para tu próximo proyecto.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={space.imageUrl}
                alt={space.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                ${Number(space.pricePerHour).toFixed(2)}/hr
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {space.name}
              </h2>
              <p className="text-gray-500 line-clamp-2 flex-grow">
                {space.description}
              </p>

              <Link
                href={`/spaces/${space.id}`}
                className="mt-6 block text-center w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
              >
                Ver Detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
