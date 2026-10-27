import prisma from "@/lib/prisma";
import { z } from "zod";

export const spaceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  pricePerHour: z.number().positive("El precio debe ser mayor a 0"),
  imageUrl: z.string().url("Debe ser una URL válida"),
});

export type SpaceInput = z.infer<typeof spaceSchema>;

// 1. Obtener todos los espacios, solo cuando estan activos
export async function getActiveSpaces() {
  return prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

// 2. Obtener un espacio por ID
export async function getSpaceById(id: string) {
  return prisma.space.findUnique({ where: { id } });
}

// 3. Crear un espacio (Admin)
export async function createSpace(data: SpaceInput) {
  return prisma.space.create({ data });
}

// 4. Editar un espacio (Admin)
export async function updateSpace(id: string, data: Partial<SpaceInput>) {
  return prisma.space.update({
    where: { id },
    data,
  });
}

export async function deactivateSpace(id: string) {
  // Regla 13: No se puede desactivar si tiene reservas futuras confirmadas
  const now = new Date();

  const futureReservations = await prisma.reservation.count({
    where: {
      spaceId: id,
      status: "CONFIRMED",
      startTime: { gte: now },
    },
  });

  if (futureReservations > 0) {
    throw new Error("SPACE_HAS_FUTURE_RESERVATIONS");
  }

  // Regla 12: No se elimina, solo se cambia el estado isActive a false
  return prisma.space.update({
    where: { id },
    data: { isActive: false },
  });
}
