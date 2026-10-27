import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import { deactivateSpace } from "@/services/space.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "No autorizado" } },
        { status: 403 },
      );
    }

    const { id } = await params;

    await deactivateSpace(id);

    return NextResponse.json({ message: "Espacio desactivado correctamente" });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "SPACE_HAS_FUTURE_RESERVATIONS"
    ) {
      return NextResponse.json(
        {
          error: {
            code: "SPACE_HAS_FUTURE_RESERVATIONS",
            message: "No se puede desactivar, tiene reservas futuras",
          },
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Error al desactivar" } },
      { status: 500 },
    );
  }
}
