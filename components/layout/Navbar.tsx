"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n-context";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { User } from "@/types";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings2,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = session?.user as User | undefined;

  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(event.target as Node) &&
        trigger.current &&
        !trigger.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isPending) {
    return (
      <header className="sticky top-0 z-50 px-4">
        <nav className="mx-auto mt-6 flex min-h-16 w-full max-w-7xl items-center justify-between rounded-2xl border border-gray-200/50 bg-white/70 px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-lg" />
      </header>
    );
  }

  const isCatalog = pathname.startsWith("/spaces");
  const isDashboard = pathname.startsWith("/dashboard");

  const segmentItem =
    "inline-flex min-w-28 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95";

  return (
    <header className="sticky top-0 z-50 px-4">
      <nav className="mx-auto mt-6 flex min-h-16 w-full max-w-7xl items-center justify-between rounded-2xl border border-gray-200/50 bg-white/70 px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-lg">
        <div className="flex w-1/3 items-center">
          <Link
            href="/"
            className="group flex items-center gap-2 active:scale-[0.98]"
            aria-label="CoSpace home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-900 transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <rect
                  x="4"
                  y="4"
                  width="10"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="10"
                  y="10"
                  width="10"
                  height="10"
                  rx="2"
                  fill="currentColor"
                  fillOpacity="0.12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M14 4v6M4 14h6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-gray-900">
              CoSpace
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {session ? (
            <div className="flex items-center rounded-full bg-zinc-100/90 p-1 shadow-inner">
              <Link
                href="/spaces"
                className={`${segmentItem} ${
                  isCatalog
                    ? "bg-white text-ink shadow-[0_3px_12px_rgba(24,24,27,0.10)]"
                    : "text-zinc-500 hover:text-ink"
                }`}
              >
                <Store className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("nav.catalog")}</span>
              </Link>
              <Link
                href="/dashboard"
                className={`${segmentItem} ${
                  isDashboard
                    ? "bg-white text-ink shadow-[0_3px_12px_rgba(24,24,27,0.10)]"
                    : "text-zinc-500 hover:text-ink"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("nav.dashboard")}</span>
              </Link>
            </div>
          ) : (
            <div className="rounded-full bg-zinc-100/90 p-1 shadow-inner">
              <Link
                href="/spaces"
                className={`${segmentItem} ${
                  isCatalog
                    ? "bg-white text-ink shadow-[0_3px_12px_rgba(24,24,27,0.10)]"
                    : "text-zinc-500 hover:text-ink"
                }`}
              >
                <Store className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("nav.catalog")}</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex w-1/3 items-center justify-end gap-2">
          <LanguageSwitcher />

          {session ? (
            <div className="relative">
              <button
                ref={trigger}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-11 items-center gap-2 rounded-full border border-gray-100 bg-white px-1.5 pr-2.5 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-95"
                aria-label="Abrir menú de usuario"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-black text-gray-700">
                  AC
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  strokeWidth={1.8}
                />
              </button>

              {open && (
                <div
                  ref={dropdown}
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
                >
                  <div className="px-3 py-3">
                    <p className="truncate text-sm font-bold text-gray-900">
                      Administrador CoSpace
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {user?.email || "Administrador"}
                    </p>
                  </div>

                  <hr className="my-1 border-gray-100" />

                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin/spaces"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Settings2 className="h-4 w-4" strokeWidth={1.8} />
                      Panel Admin
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <UserRound className="h-4 w-4" strokeWidth={1.8} />
                    Mi Perfil
                  </Link>

                  <hr className="my-1 border-gray-100" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-100 hover:text-ink active:scale-95"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(24,24,27,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-700 active:scale-95"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{t("nav.register")}</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
