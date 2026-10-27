"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Space, User } from "@/types";

export default function AdminSpacesPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user as User | undefined;

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl] = useState("https://placehold.co/600x400/png");
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
    setLoading(true);

    try {
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
      if (!res.ok) throw new Error(data.error.message);

      setName("");
      setDescription("");
      setPrice("");
      fetchSpaces();
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
      <div className="p-12 text-center text-gray-500 font-medium">
        Cargando panel...
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-12 text-center text-red-600 font-bold text-xl bg-red-50 rounded-2xl max-w-2xl mx-auto mt-10">
        Acceso denegado. No tienes permisos de administrador.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Gestión de Espacios
            </h1>
            <p className="text-slate-500 mt-1">
              Administra el catálogo de CoSpace.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-xl shadow-sm border border-blue-200">
            Total: {spaces.length} espacios
          </div>
        </div>

        {/* Formulario de Creación */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </span>
            Añadir Nuevo Espacio
          </h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nombre del espacio
              </label>
              <input
                type="text"
                placeholder="Ej. Sala de Innovación"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Precio por hora (USD)
              </label>
              <input
                type="number"
                placeholder="Ej. 25"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                placeholder="Describe las características del espacio..."
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? "Creando espacio..." : "Crear Espacio"}
            </button>
          </form>
          {error && (
            <p className="text-red-500 mt-4 font-medium text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider uppercase">
                <th className="p-5 font-bold">Espacio</th>
                <th className="p-5 font-bold">Precio</th>
                <th className="p-5 font-bold">Estado</th>
                <th className="p-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {spaces.map((space) => (
                <tr
                  key={space.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="p-5">
                    <p className="font-bold text-slate-900">{space.name}</p>
                    <p className="text-sm text-slate-500 truncate max-w-xs">
                      {space.description}
                    </p>
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-slate-700">
                      ${Number(space.pricePerHour).toFixed(2)}
                    </span>
                    <span className="text-sm text-slate-400"> /hr</span>
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        space.isActive
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${space.isActive ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      {space.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {space.isActive ? (
                      <button
                        onClick={() => handleDeactivate(space.id)}
                        className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 italic">
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
                    className="p-10 text-center text-slate-500 font-medium"
                  >
                    No hay espacios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
