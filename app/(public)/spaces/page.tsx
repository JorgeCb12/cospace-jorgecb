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
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Encuentra tu espacio perfecto
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Explora nuestra selección de escritorios, salas de juntas y cabinas
            diseñadas para potenciar tu productividad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={space.imageUrl}
                  alt={space.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                  <span className="text-sm font-black text-slate-900">
                    ${Number(space.pricePerHour).toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-500"> /hr</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-white">
                <h2 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                  {space.name}
                </h2>

                <p className="text-sm text-slate-500 line-clamp-2 flex-grow mb-4 leading-relaxed">
                  {space.description}
                </p>

                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium mb-6 pt-4 border-t border-slate-100">
                  <div
                    className="flex items-center gap-1.5"
                    title="Wi-Fi de alta velocidad"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="Zona de café"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5z"
                      ></path>
                    </svg>
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="Aire acondicionado"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <Link
                  href={`/spaces/${space.id}`}
                  className="block text-center w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl group-hover:bg-blue-600 transition-colors duration-300"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
