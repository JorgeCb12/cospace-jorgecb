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

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-bold text-lg animate-pulse">
          Cargando tus reservas...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Mis Reservas
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Gestiona y revisa el historial de tus espacios reservados.
            </p>
          </div>
          <Link
            href="/spaces"
            className="inline-flex items-center justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
          >
            <span className="mr-2">+</span> Nueva Reserva
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-200 font-bold flex items-center gap-2 shadow-sm">
            {error}
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm bordersborder-slate-200 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-blue-500">Rs</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Aún no tienes reservas
            </h3>
            <p className="text-slate-500 mb-8 max-w-md">
              Parece que no has reservado ningún espacio todavía. Explora
              nuestro catálogo y encuentra el lugar perfecto para trabajar.
            </p>
            <Link
              href="/spaces"
              className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-black transition-colors"
            >
              Explorar Espacios
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-2xl text-slate-900">
                        {res.space.name}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          res.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {res.status === "CONFIRMED"
                          ? "Confirmada"
                          : "Cancelada"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-slate-500 font-medium mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📅</span>
                        {new Date(res.startTime).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">🕒</span>
                        {new Date(res.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(res.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Total Pagado
                      </p>
                      <p className="text-3xl font-black text-slate-900">
                        ${Number(res.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    {res.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(res.id)}
                        className="mt-0 md:mt-4 text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100"
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
