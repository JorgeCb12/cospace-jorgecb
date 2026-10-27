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

      if (!res.ok) {
        throw new Error(data.error.code || data.error.message);
      }

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
    return <div className="p-8 text-center">Cargando reservas...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border">
          <p className="text-gray-500 mb-4">No tienes reservas aún.</p>
          <Link
            href="/spaces"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Explorar espacios
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="bg-white p-6 rounded-xl shadow-sm border flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{res.space.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(res.startTime).toLocaleString()} -{" "}
                  {new Date(res.endTime).toLocaleTimeString()}
                </p>
                <p className="text-sm font-semibold mt-2">
                  Total: ${Number(res.totalPrice).toFixed(2)}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
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
                    className="block text-sm text-red-600 hover:underline"
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
