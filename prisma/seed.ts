import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
  const adminEmail = "admin@example.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("El administrador ya existe, saltando...");
    return;
  }

  console.log("Creando usuario administrador...");

  // 2. Usamos Better Auth para crear el usuario (esto hashea la contraseña)
  await auth.api.signUpEmail({
    body: {
      email: adminEmail,
      password: "Admin123!",
      name: "Administrador",
    },
  });

  console.log("Admin creado con éxito: admin@example.com / Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
