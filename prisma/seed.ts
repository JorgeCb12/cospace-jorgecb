import { auth } from "../lib/auth";
import prisma from "../lib/prisma";

async function main() {
  const adminEmail = "admin@cospace.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: "Admin123!",
        name: "Administrador CoSpace",
      },
    });
  }

  const spacesCount = await prisma.space.count();
  if (spacesCount === 0) {
    await prisma.space.createMany({
      data: [
        {
          name: "Escritorio Hot Desk",
          description:
            "Escritorio flexible en zona común, ideal para trabajo individual.",
          pricePerHour: 10.0,
          imageUrl: "https://placehold.co/600x400/png?text=Hot+Desk",
          isActive: true,
        },
        {
          name: "Sala de Juntas",
          description:
            "Sala privada con capacidad para 8 personas, proyector y pizarra.",
          pricePerHour: 25.0,
          imageUrl: "https://placehold.co/600x400/png?text=Sala+Juntas",
          isActive: true,
        },
        {
          name: "Cabina Focus",
          description:
            "Cabina insonorizada perfecta para llamadas y videoconferencias.",
          pricePerHour: 15.0,
          imageUrl: "https://placehold.co/600x400/png?text=Cabina",
          isActive: true,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
