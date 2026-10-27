import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";

export const metadata: Metadata = {
  title: "CoSpace - Reservas de Coworking",
  description: "Plataforma para reservar espacios de coworking por horas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
