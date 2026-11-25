"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Reservation } from "@/types";
import {
  ArrowRight,
  CalendarRange,
  CircleHelp,
  Clock3,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

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
      <div className="min-h-[70vh] bg-canvas flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
          <RotateCcw className="h-4 w-4 animate-spin text-olive-600" />
          Cargando tus reservas...
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,24,27,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(24,24,27,.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent 82%)",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-olive-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-olive-600">
              Tu espacio
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tighter text-ink sm:text-5xl">
              Mis Reservas
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500 sm:text-base">
              Gestiona y revisa el historial de tus espacios reservados.
            </p>
          </div>
          <Link
            href="/spaces"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-olive-600/10 bg-linear-to-r from-olive-700 to-olive-600 px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(85,93,66,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(85,93,66,0.28)] active:scale-95"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Nueva Reserva
          </Link>
        </header>

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-terracotta-100 bg-terracotta-50 px-5 py-4 text-sm font-bold text-terracotta-600 shadow-sm">
            <CircleHelp className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {reservations.length === 0 ? (
          <section className="relative flex min-h-117.5 flex-col items-center justify-center overflow-hidden rounded-4xl border border-white bg-white/80 px-6 py-14 text-center shadow-[0_24px_70px_rgba(24,24,27,0.07)] backdrop-blur-sm">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-olive-100/70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-terracotta-50/80 blur-3xl" />

            <div className="relative mb-7">
              <svg
                viewBox="0 0 220 180"
                role="img"
                aria-label="Calendario y edificio de coworking"
                className="h-44 w-55 overflow-visible"
              >
                <defs>
                  <linearGradient id="calendarFill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F4F5EE" />
                    <stop offset="1" stopColor="#E8EADF" />
                  </linearGradient>
                </defs>
                <circle cx="174" cy="42" r="26" fill="#FBF4F0" />
                <path
                  d="M58 35h104a12 12 0 0112 12v98H46V47a12 12 0 0112-12z"
                  fill="url(#calendarFill)"
                  stroke="#697153"
                  strokeWidth="2"
                />
                <path d="M46 70h128" stroke="#697153" strokeWidth="2" />
                <path
                  d="M70 24v22M150 24v22"
                  stroke="#454B35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect
                  x="70"
                  y="92"
                  width="28"
                  height="28"
                  rx="7"
                  fill="#FFFFFF"
                  stroke="#A56A56"
                  strokeWidth="2"
                />
                <path
                  d="M84 99v14M77 106h14"
                  stroke="#A56A56"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="112"
                  y="92"
                  width="38"
                  height="53"
                  rx="19"
                  fill="#FFFFFF"
                  stroke="#697153"
                  strokeWidth="2"
                />
                <circle cx="131" cy="116" r="5" fill="#697153" />
                <path
                  d="M131 121v12"
                  stroke="#697153"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M28 145h164"
                  stroke="#D4D4D8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 127c9-10 18-10 27 0M176 86c9-10 18-10 27 0"
                  fill="none"
                  stroke="#A56A56"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="3 5"
                />
              </svg>
            </div>

            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-olive-600">
              Tu próxima sesión
            </p>
            <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tighter text-ink sm:text-5xl">
              Tu agenda está lista para comenzar.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500 sm:text-base">
              Aún no tienes reservas. Descubre espacios pensados para enfocarte,
              colaborar y trabajar a tu manera.
            </p>

            <Link
              href="/spaces"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-black text-white shadow-[0_14px_34px_rgba(24,24,27,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-olive-700 active:scale-95"
            >
              Explorar espacios
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:soporte@cospace.app"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-zinc-400 transition-colors hover:text-olive-600"
            >
              <CircleHelp className="h-3.5 w-3.5" /> ¿Necesitas ayuda?
            </a>
          </section>
        ) : (
          <div className="grid gap-5">
            {reservations.map((res) => (
              <article
                key={res.id}
                className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_12px_40px_rgba(24,24,27,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(24,24,27,0.09)]"
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                  <div className="min-w-0 grow">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="truncate text-2xl font-black tracking-tight text-ink">
                        {res.space.name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                          res.status === "CONFIRMED"
                            ? "bg-olive-50 text-olive-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {res.status === "CONFIRMED"
                          ? "Confirmada"
                          : "Cancelada"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 text-sm font-medium text-zinc-500 sm:flex-row sm:gap-6">
                      <div className="flex items-center gap-2">
                        <CalendarRange
                          className="h-4 w-4 text-olive-600"
                          strokeWidth={1.8}
                        />
                        {new Date(res.startTime).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3
                          className="h-4 w-4 text-olive-600"
                          strokeWidth={1.8}
                        />
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

                  <div className="flex w-full items-end justify-between border-t border-zinc-100 pt-5 md:w-auto md:flex-col md:items-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
                        Total pagado
                      </p>
                      <p className="mt-1 text-3xl font-black tracking-tight text-ink">
                        ${Number(res.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    {res.status === "CONFIRMED" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(res.id)}
                        className="mt-0 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-terracotta-600 transition-all hover:bg-terracotta-50 active:scale-95 md:mt-4"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
