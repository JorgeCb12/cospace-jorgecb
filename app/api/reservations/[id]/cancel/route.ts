import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import { cancelReservation } from "@/services/reservation.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "No autorizado" } },
        { status: 401 },
      );
    }

    const { id } = await params;

    await cancelReservation(id, user.id, user.role);

    return NextResponse.json({ message: "Reserva cancelada exitosamente" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "No puedes cancelar esta reserva",
            },
          },
          { status: 403 },
        );
      }
      if (error.message === "RESERVATION_NOT_FOUND") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Reserva no encontrada" } },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: {
            code: error.message,
            message: "No se puede cancelar la reserva",
          },
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Error en el servidor" } },
      { status: 500 },
    );
  }
}
