"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthGuard } from "@/lib/use-auth-guard";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useAuthGuard();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div className="p-8">Cargando sesión...</div>;
  if (!session) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Bienvenido, {session.user.name}</p>
      <p className="text-sm text-gray-500">Email: {session.user.email}</p>

      <button
        onClick={async () => {
          await signOut();
          router.push("/login");
        }}
        className="mt-6 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
