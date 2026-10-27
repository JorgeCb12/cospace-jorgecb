import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";
import {
  createReservation,
  createReservationSchema,
} from "@/services/reservation.service";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión" } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsedData = createReservationSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Datos inválidos" } },
        { status: 400 },
      );
    }

    const reservation = await createReservation(user.id, parsedData.data);

    return NextResponse.json({ data: reservation }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: { code: error.message, message: "Regla de negocio violada" } },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Error en el servidor" } },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión" } },
        { status: 401 },
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      include: { space: true },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ data: reservations });
  } catch (error) {
    return NextResponse.json(
      {
        error: { code: "INTERNAL_ERROR", message: "Error al obtener reservas" },
      },
      { status: 500 },
    );
  }
}
