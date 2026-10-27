"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n-context";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { User } from "@/types";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const user = session?.user as User | undefined;

  if (isPending)
    return <nav className="h-16 border-b bg-white sticky top-0 z-50"></nav>;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-extrabold text-blue-600 tracking-tight"
        >
          CoSpace<span className="text-blue-400">.</span>
        </Link>
        <Link
          href="/spaces"
          className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
        >
          {t("nav.catalog")}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <LanguageSwitcher />

        {session ? (
          <>
            {user?.role === "ADMIN" && (
              <Link
                href="/admin/spaces"
                className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
              >
                {t("nav.admin")}
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t("nav.dashboard")}
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
              {user?.name}
            </span>
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
            >
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              {t("nav.register")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
