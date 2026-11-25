"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Space, User } from "@/types";
import {
  Building2,
  Plus,
  RotateCcw,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";

export default function AdminSpacesPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as User | undefined;

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSpaces = async () => {
    const res = await fetch("/api/admin/spaces");
    const data = await res.json();
    if (res.ok) setSpaces(data.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchSpaces();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Selecciona una imagen para el espacio");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("foto", file);

      const uploadRes = await fetch("/api/fotos", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "No se pudo subir la imagen");
      }

      const imageUrl = uploadData.key as string;

      const res = await fetch("/api/admin/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          pricePerHour: Number(price),
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "No se pudo crear el espacio");
      }

      setName("");
      setDescription("");
      setPrice("");
      setFile(null);
      await fetchSpaces();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("¿Seguro que quieres desactivar este espacio?")) return;
    try {
      const res = await fetch(`/api/admin/spaces/${id}/deactivate`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error.code === "SPACE_HAS_FUTURE_RESERVATIONS"
            ? "No puedes desactivar un espacio con reservas futuras."
            : data.error.message,
        );
      }
      fetchSpaces();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm font-bold text-zinc-400">
        Cargando panel...
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="mx-auto mt-10 flex max-w-xl items-start gap-4 rounded-3xl border border-terracotta-100 bg-terracotta-50 p-6 text-terracotta-600">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-black text-ink">Acceso denegado</p>
          <p className="mt-1 text-sm">No tienes permisos de administrador.</p>
        </div>
      </div>
    );
  }

  const activeCount = spaces.filter((space) => space.isActive).length;

  return (
    <main className="min-h-screen bg-canvas px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Admin <span className="mx-1 text-gray-300">/</span> Espacios
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tighter text-ink sm:text-5xl">
              Gestión de espacios
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Activos
              </p>
              <p className="mt-0.5 text-xl font-black text-olive-700">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Catálogo
              </p>
              <p className="mt-0.5 text-xl font-black text-ink">
                {spaces.length}
              </p>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-4xl border border-white bg-white p-5 shadow-[0_18px_50px_rgba(24,24,27,0.07)] sm:p-7">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
                <Plus className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-black tracking-tight text-ink">
                  Añadir nuevo espacio
                </h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Completa los detalles del lugar
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-600">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sala de Innovación"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 py-3 pl-10 pr-4 text-sm text-ink outline-none transition-all placeholder:text-zinc-400 focus:border-olive-500 focus:ring-4 focus:ring-olive-100/70"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-600">
                  Precio por hora
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-zinc-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="25.00"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 py-3 pl-8 pr-14 text-sm text-ink outline-none transition-all placeholder:text-zinc-400 focus:border-olive-500 focus:ring-4 focus:ring-olive-100/70"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                    / hr
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-600">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe el ambiente y las características..."
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm leading-6 text-ink outline-none transition-all placeholder:text-zinc-400 focus:border-olive-500 focus:ring-4 focus:ring-olive-100/70"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-zinc-600">
                  Imagen del espacio
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/70 py-3 px-4 text-sm text-ink outline-none transition-all placeholder:text-zinc-400 focus:border-olive-500 focus:ring-4 focus:ring-olive-100/70"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(24,24,27,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {loading ? "Creando espacio..." : "Crear espacio"}
              </button>

              {error && (
                <p className="rounded-2xl border border-terracotta-100 bg-terracotta-50 p-3 text-sm font-medium text-terracotta-600">
                  {error}
                </p>
              )}
            </form>
          </section>

          <section className="overflow-hidden rounded-4xl border border-white bg-white shadow-[0_18px_50px_rgba(24,24,27,0.07)]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-lg font-black tracking-tight text-ink">
                  Inventario
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Todos los espacios de tu cuenta
                </p>
              </div>
              <Users className="h-5 w-5 text-olive-600" strokeWidth={1.8} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-155 text-left">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
                    <th className="px-7 py-4">Espacio</th>
                    <th className="px-4 py-4">Precio</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-7 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {spaces.map((space) => (
                    <tr
                      key={space.id}
                      className="group transition-colors hover:bg-zinc-50/70"
                    >
                      <td className="px-7 py-5">
                        <p className="max-w-55 truncate text-sm font-black text-ink">
                          {space.name}
                        </p>
                        <p className="mt-1 max-w-55 truncate text-xs leading-5 text-zinc-400">
                          {space.description}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-sm font-black text-ink">
                          ${Number(space.pricePerHour).toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-400"> / hr</span>
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${space.isActive ? "bg-olive-50 text-olive-700" : "bg-terracotta-50 text-terracotta-600"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${space.isActive ? "bg-olive-600" : "bg-terracotta-500"}`}
                          />
                          {space.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-7 py-5 text-right">
                        {space.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(space.id)}
                            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-bold text-zinc-400 transition-all hover:bg-terracotta-50 hover:text-terracotta-600 active:scale-95"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden xl:inline">Desactivar</span>
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-zinc-300">
                            Sin acciones
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {spaces.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-7 py-16 text-center text-sm font-medium text-zinc-400"
                      >
                        No hay espacios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
