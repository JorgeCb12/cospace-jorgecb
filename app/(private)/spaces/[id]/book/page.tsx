"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookSpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId: id,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.code || "ERROR_AL_CREAR");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessages: Record<string, string> = {
          INVALID_TIME_FORMAT:
            "Las horas deben ser exactas (ej. 10:00, no 10:30).",
          INVALID_DURATION: "La reserva debe durar entre 1 y 4 horas.",
          OUTSIDE_OPERATING_HOURS:
            "Solo se puede reservar entre las 7:00 y las 21:00.",
          INVALID_PAST_DATE: "No puedes reservar en el pasado.",
          TOO_FAR_IN_ADVANCE:
            "Solo puedes reservar con 30 días de anticipación como máximo.",
          MAX_RESERVATIONS_REACHED:
            "Ya tienes 3 reservas activas. Cancela una para poder reservar.",
          SPACE_OVERLAP: "Este espacio ya está reservado en ese horario.",
          USER_OVERLAP: "Ya tienes otra reserva en ese mismo horario.",
          SPACE_INACTIVE: "Este espacio ha sido desactivado.",
        };
        setError(
          errorMessages[err.message] ||
            "Ocurrió un error al procesar la reserva.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Reservar Espacio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha y Hora de Inicio
          </label>
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha y Hora de Fin
          </label>
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          href={`/spaces/${id}`}
          className="text-sm text-gray-500 hover:underline"
        >
          Cancelar y volver
        </Link>
      </div>
    </div>
  );
}
