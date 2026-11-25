import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Users, Wifi } from "lucide-react";

export const dynamic = "force-dynamic";

const editorialImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=85",
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const spaces = await prisma.space.findMany({
    where: {
      isActive: true,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-canvas pb-20">
      <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-olive-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-terracotta-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-olive-600">
              Espacios para trabajar mejor
            </p>
            <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tighter text-ink sm:text-7xl lg:text-[5.75rem]">
              Encuentra tu{" "}
              <span className="italic text-olive-600">espacio</span>
              <br /> perfecto.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
              Escritorios, salas y lugares excepcionales diseñados para que el
              trabajo vuelva a sentirse inspirador.
            </p>
          </div>

          <form
            action="/spaces"
            className="group/form mt-10 flex h-16 max-w-3xl items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-200 focus-within:ring-2 focus-within:ring-black/10"
          >
            <Search
              className="ml-4 h-5 w-5 shrink-0 text-gray-400"
              strokeWidth={1.8}
            />
            <input
              name="q"
              defaultValue={query}
              placeholder="Busca por nombre o descripción"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm font-medium text-ink outline-none placeholder:text-gray-400 sm:text-base"
            />
            <button
              type="submit"
              className="h-full rounded-full bg-black px-6 text-sm font-bold text-white transition-all duration-200 hover:bg-gray-800 active:scale-95 sm:px-8"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-olive-600">
              Selección curada
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tighter text-ink sm:text-4xl">
              {query ? `Resultados para “${query}”` : "Espacios disponibles"}
            </h2>
          </div>
          <p className="hidden text-sm font-medium text-zinc-400 sm:block">
            {spaces.length} {spaces.length === 1 ? "lugar" : "lugares"}
          </p>
        </div>

        {spaces.length === 0 ? (
          <div className="rounded-4xl border border-zinc-200/70 bg-white px-6 py-16 text-center">
            <p className="font-black text-ink">No encontramos coincidencias.</p>
            <Link
              href="/spaces"
              className="mt-3 inline-block text-sm font-bold text-olive-600 hover:text-olive-700"
            >
              Ver todos los espacios
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space, index) => {
              const featured = index === 0;
              const imageUrl = space.imageUrl?.includes("placehold.co")
                ? editorialImages[index % editorialImages.length]
                : space.imageUrl;

              return (
                <article
                  key={space.id}
                  className={`group relative overflow-hidden rounded-3xl bg-zinc-100 ${
                    featured
                      ? "h-130 md:col-span-2 md:h-155 lg:col-span-2 lg:row-span-2 lg:h-155"
                      : "h-80 md:h-75"
                  }`}
                >
                  <Link
                    href={`/spaces/${space.id}`}
                    className="absolute inset-0 block"
                  >
                    <Image
                      src={imageUrl}
                      alt={space.name}
                      fill
                      sizes={
                        featured
                          ? "(max-width: 768px) 100vw, 66vw"
                          : "(max-width: 768px) 100vw, 33vw"
                      }
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />

                    <div className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/85 px-4 py-2 text-sm font-bold text-ink shadow-lg backdrop-blur-md">
                      ${Number(space.pricePerHour).toFixed(2)}
                      <span className="ml-1 text-xs font-semibold text-zinc-500">
                        / hr
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-16 text-white">
                      <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-olive-100">
                        {space.name}
                      </h3>
                      <p className="mt-2 max-w-xl line-clamp-2 text-sm leading-6 text-white/75">
                        {space.description}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                          <Wifi className="h-3.5 w-3.5" strokeWidth={1.8} />{" "}
                          Wi-Fi
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                          <Users className="h-3.5 w-3.5" strokeWidth={1.8} />{" "}
                          Flexible
                        </span>
                      </div>
                    </div>

                    <span className="absolute bottom-5 right-5 flex h-11 w-11 scale-90 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowRight className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
