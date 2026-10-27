"use client";

import { useEffect, useState } from "react";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <span className="text-gray-400 font-mono text-sm">Cargando hora...</span>
    );
  }

  return (
    <span className="text-gray-700 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
      Hora local: {time}
    </span>
  );
}
