"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setGlobalError("");
    setLoading(true);

    await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      fetchOptions: {
        onSuccess: () => router.replace("/dashboard"),
        onError: (ctx) =>
          setGlobalError(ctx.error.message || "Error al registrar"),
      },
    });

    setLoading(false);
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold">Crear Cuenta</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {globalError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {globalError}
          </div>
        )}

        <Input
          label="Nombre"
          type="text"
          {...register("name")}
          error={errors.name?.message}
        />
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
          {loading ? "Cargando..." : "Registrarse"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </>
  );
}
