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

  if (isPending) {
    return <nav className="border-b bg-white px-6 py-4 h-16"></nav>;
  }

  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-600">
          CoSpace
        </Link>
        <Link
          href="/spaces"
          className="text-sm font-medium text-gray-600 hover:text-blue-600"
        >
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
                className="text-sm font-medium text-purple-600 hover:underline"
              >
                {t("nav.admin")}
              </Link>
            )}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {t("nav.dashboard")}
            </Link>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              {t("nav.logout")}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t("nav.register")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
