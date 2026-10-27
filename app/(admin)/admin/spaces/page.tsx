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

  const fetchSpaces = async () => {
    const res = await fetch("/api/spaces");
    const data = await res.json();
    setSpaces(data.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchSpaces();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
    return <div className="p-8 text-center">Cargando panel...</div>;
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-red-600 font-bold text-xl">
        Acceso denegado. No tienes permisos de administrador.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Espacios (Admin)</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-xl font-bold mb-4">Añadir Nuevo Espacio</h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Nombre"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Precio por hora"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded md:col-span-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2 font-bold"
          >
            Crear Espacio
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nombre</th>
              <th className="p-4 font-semibold text-gray-600">Precio/Hora</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map((space) => (
              <tr key={space.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{space.name}</td>
                <td className="p-4">
                  ${Number(space.pricePerHour).toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${space.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {space.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="p-4">
                  {space.isActive && (
                    <button
                      onClick={() => handleDeactivate(space.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
