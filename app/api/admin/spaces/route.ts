import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import { createSpace, spaceSchema } from "@/services/space.service";

export async function POST(req: NextRequest) {
  try {
    // 1. Validar sesión y rol
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión" } },
        { status: 401 },
      );
    }
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "No tienes permisos de administrador",
          },
        },
        { status: 403 },
      );
    }

    // 2. Validar datos de entrada
    const body = await req.json();
    const parsedData = spaceSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Datos inválidos" } },
        { status: 400 },
      );
    }

    // 3. Crear el espacio
    const space = await createSpace(parsedData.data);

    return NextResponse.json({ data: space }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: { code: "INTERNAL_ERROR", message: "Error al crear el espacio" },
      },
      { status: 500 },
    );
  }
}
