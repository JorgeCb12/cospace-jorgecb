"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export function useAuthGuard() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) return;

    const handlePopState = () => {
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register" ||
        window.location.pathname === "/"
      ) {
        window.location.replace("/dashboard");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [session, router, pathname]);
}
