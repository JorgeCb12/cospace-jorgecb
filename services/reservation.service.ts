import prisma from "@/lib/prisma";
import { z } from "zod";

export const createReservationSchema = z.object({
  spaceId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export async function createReservation(
  userId: string,
  input: CreateReservationInput,
) {
  const { spaceId, startTime, endTime } = input;

  return await prisma.$transaction(async (tx) => {
    const space = await tx.space.findUnique({ where: { id: spaceId } });
    if (!space) throw new Error("SPACE_NOT_FOUND");
    if (!space.isActive) throw new Error("SPACE_INACTIVE");

    // 2. Reglas 1 y 2: Horas completas (minutos = 00) y Horario (7:00 a 21:00)
    if (startTime.getMinutes() !== 0 || endTime.getMinutes() !== 0) {
      throw new Error("INVALID_TIME_FORMAT");
    }

    const startHour = startTime.getHours();
    const endHour = endTime.getHours();
    const diffHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1 || diffHours > 4) throw new Error("INVALID_DURATION");
    if (startHour < 7 || endHour > 21 || startHour >= endHour) {
      throw new Error("OUTSIDE_OPERATING_HOURS");
    }

    // 3. Regla 3: Ni en el pasado ni con más de 30 días
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    if (startTime < now) throw new Error("INVALID_PAST_DATE");
    if (startTime > thirtyDaysFromNow) throw new Error("TOO_FAR_IN_ADVANCE");

    // 4. Regla 6: Máximo 3 reservas futuras confirmadas por usuario
    const futureReservationsCount = await tx.reservation.count({
      where: {
        userId,
        status: "CONFIRMED",
        startTime: { gte: now },
      },
    });
    if (futureReservationsCount >= 3) {
      throw new Error("MAX_RESERVATIONS_REACHED");
    }

    // 5. Reglas 4 y 5: Solapamientos (Mismo espacio o mismo usuario)
    const overlappingReservation = await tx.reservation.findFirst({
      where: {
        status: "CONFIRMED",
        OR: [{ spaceId: spaceId }, { userId: userId }],
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });

    if (overlappingReservation) {
      if (overlappingReservation.spaceId === spaceId) {
        throw new Error("SPACE_OVERLAP");
      } else {
        throw new Error("USER_OVERLAP");
      }
    }

    // 6. Regla 8: Calcular precio en el servidor
    const totalPrice = Number(space.pricePerHour) * diffHours;

    // 7. Guardar la reserva en la base de datos (usando tx)
    const reservation = await tx.reservation.create({
      data: {
        userId,
        spaceId,
        startTime,
        endTime,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return reservation;
  });
}

export async function cancelReservation(
  reservationId: string,
  userId: string,
  userRole: string,
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) throw new Error("RESERVATION_NOT_FOUND");

  if (reservation.userId !== userId && userRole !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (reservation.status === "CANCELLED") {
    throw new Error("ALREADY_CANCELLED");
  }

  // Regla 10: Cancelar hasta 2 horas antes
  const now = new Date();
  const twoHoursBefore = new Date(
    reservation.startTime.getTime() - 2 * 60 * 60 * 1000,
  );

  if (now > twoHoursBefore) {
    throw new Error("TOO_LATE_TO_CANCEL");
  }

  // Regla 11: Soft delete (solo cambiar estado)
  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });
}
