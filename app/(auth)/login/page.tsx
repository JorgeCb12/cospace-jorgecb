"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

export default function LoginPage() {
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
        onSuccess: () => {
          router.replace("/dashboard");
        },
        onError: (ctx) => {
          setGlobalError(
            ctx.error.message || "Correo o contraseña incorrectos.",
          );
        },
      },
    });

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {globalError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {globalError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
