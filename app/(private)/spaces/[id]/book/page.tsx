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
    <div className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-3xl mt-12 border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Confirmar Reserva
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Fecha y Hora de Inicio
          </label>
          <input
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Fecha y Hora de Fin
          </label>
          <input
            type="datetime-local"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href={`/spaces/${id}`}
          className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancelar y volver
        </Link>
      </div>
    </div>
  );
}
