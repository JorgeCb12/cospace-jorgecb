"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation"; // <-- Añadimos usePathname
import { useTranslation } from "@/lib/i18n-context";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { User } from "@/types";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const user = session?.user as User | undefined;

  if (isPending)
    return <nav className="h-16 border-b bg-white sticky top-0 z-50"></nav>;

  const isCatalog = pathname.startsWith("/spaces");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight mr-4"
        >
          CoSpace<span className="text-blue-400">.</span>
        </Link>

        <Link
          href="/spaces"
          className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 ${
            isCatalog
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          {t("nav.catalog")}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {session ? (
          <>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/spaces"
                className={`text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                  isAdmin
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-100"
                }`}
              >
                {t("nav.admin")}
              </Link>
            )}

            <Link
              href="/dashboard"
              className={`text-sm font-bold px-4 py-2 rounded-full transition-all duration-200 ${
                isDashboard
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              {t("nav.dashboard")}
            </Link>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <span className="text-sm font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
              {user?.name}
            </span>

            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-full transition-all duration-200"
            >
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              {t("nav.register")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
