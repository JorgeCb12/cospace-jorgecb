import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma"; // Importamos Prisma

export async function getSessionUser(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return dbUser;
}
