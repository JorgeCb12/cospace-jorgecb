"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;

    const fetchReservations = async () => {
      try {
        const res = await fetch("/api/reservations");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error.message);
        setReservations(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [session]);

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setError("");

    try {
      const res = await fetch(`/api/reservations/${id}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error.code || data.error.message);

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r)),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "TOO_LATE_TO_CANCEL") {
          setError(
            "No puedes cancelar una reserva con menos de 2 horas de anticipación.",
          );
        } else {
          setError(err.message);
        }
      }
    }
  };

  if (isPending || loading)
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        Cargando reservas...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        Mis Reservas
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-6 text-lg">Aún no tienes reservas.</p>
          <Link
            href="/spaces"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Explorar espacios
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-xl text-gray-900">
                  {res.space.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(res.startTime).toLocaleString()} -{" "}
                  {new Date(res.endTime).toLocaleTimeString()}
                </p>
                <p className="text-lg font-black text-gray-900 mt-2">
                  Total: ${Number(res.totalPrice).toFixed(2)}
                </p>
              </div>

              <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-3 ${
                    res.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {res.status === "CONFIRMED" ? "Confirmada" : "Cancelada"}
                </span>

                {res.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors"
                  >
                    Cancelar reserva
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
