"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return <nav className="border-b bg-white px-6 py-4 h-16"></nav>;
  }

  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600">
        FullstackApp
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-gray-600">
              Hola,{" "}
              <strong className="text-gray-900">{session.user.name}</strong>
            </span>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Dashboard
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
