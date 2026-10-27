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
      <h2 className="text-center text-2xl font-bold">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {globalError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {globalError}
          </div>
        )}

        <Input
          label="Correo"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

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
    </>
  );
}
