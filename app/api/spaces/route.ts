import { NextResponse } from "next/server";
import { getActiveSpaces } from "@/services/space.service";

export async function GET() {
  try {
    const spaces = await getActiveSpaces();
    return NextResponse.json({ data: spaces });
  } catch (error) {
    return NextResponse.json(
      {
        error: { code: "INTERNAL_ERROR", message: "Error al obtener espacios" },
      },
      { status: 500 },
    );
  }
}
