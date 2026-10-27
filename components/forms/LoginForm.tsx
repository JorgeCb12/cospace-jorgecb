"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";
import { User } from "@/types";

export function LoginForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setGlobalError("");
    setLoading(true);

    await signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: (ctx) => {
          const loggedUser = ctx.data?.user as User | undefined;
          if (loggedUser?.role === "ADMIN") {
            router.replace("/admin/spaces");
          } else {
            router.replace("/dashboard");
          }
        },
        onError: (ctx) =>
          setGlobalError(ctx.error.message || "Credenciales incorrectas"),
      },
    });

    setLoading(false);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Bienvenido de nuevo
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Ingresa tus credenciales para acceder a CoSpace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {globalError && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
            <span>⚠️</span> {globalError}
          </div>
        )}

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          {...register("email")}
          error={errors.email?.message}
          className="bg-gray-50"
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
          className="bg-gray-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 p-3.5 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-200 mt-2"
        >
          {loading ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-8">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Regístrate aquí
        </Link>
      </p>
    </>
  );
}
