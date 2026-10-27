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
    <div className="max-w-5xl mx-auto p-8">
      <Link
        href="/spaces"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Volver al catálogo
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
          <Image
            src={space.imageUrl}
            alt={space.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8 w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{space.name}</h1>
            <p className="text-gray-600 mt-4 text-lg">{space.description}</p>

            <div className="mt-6 border-t pt-4">
              <p className="text-xl font-semibold text-gray-800">
                Precio:{" "}
                <span className="text-blue-600">
                  ${Number(space.pricePerHour).toFixed(2)}
                </span>{" "}
                / hora
              </p>
            </div>
          </div>

          <Link
            href={`/spaces/${space.id}/book`}
            className="mt-8 block text-center w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reservar este espacio
          </Link>
        </div>
      </div>
    </div>
  );
}
