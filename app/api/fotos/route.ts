import { NextRequest, NextResponse } from "next/server";
import { subirFoto } from "@/lib/s3/upload";
import { s3Client } from "@/lib/s3/client";
import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

export async function GET() {
  try {
    const bucket = process.env.S3_BUCKET_NAME;
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: "fotos/",
    });
    const data = await s3Client.send(command);

    if (!data.Contents) return NextResponse.json([]);

    const fotos = await Promise.all(
      data.Contents.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: item.Key,
        });
        const url = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 3600,
        });
        return { key: item.Key, url };
      }),
    );

    return NextResponse.json(fotos);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Error al listar" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("foto") as File;
    if (!file)
      return NextResponse.json({ error: "No hay foto" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await subirFoto({
      body: buffer,
      contentType: file.type,
      extension: file.name.split(".").pop() || "jpg",
    });
    return NextResponse.json({ key });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Error al subir" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key)
      return NextResponse.json({ error: "Falta la key" }, { status: 400 });

    const bucket = process.env.S3_BUCKET_NAME;
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await s3Client.send(command);

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
