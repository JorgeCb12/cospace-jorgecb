# Reglas de Negocio de CoSpace

Todas las reglas se validan en el Backend (Server-side), principalmente en la carpeta `services/`. La base de datos garantiza la integridad referencial.

## Reservas

1. **Duración de 1 a 4 horas exactas:** Validado en `reservation.service.ts`. Si los minutos no son 00, o la diferencia de horas no está entre 1 y 4, se rechaza.
2. **Horario permitido (7:00 a 21:00):** Validado en `reservation.service.ts`. Se revisa la hora de inicio y fin.
3. **Sin fechas pasadas ni > 30 días:** Validado en `reservation.service.ts` comparando con `new Date()`.
4. **Sin solapamiento en el mismo espacio:** Validado en `reservation.service.ts`. Se buscan reservas `CONFIRMED` en ese espacio donde `(startTime < newEndTime) && (endTime > newStartTime)`.
5. **Sin solapamiento para el mismo usuario:** Igual que la regla 4, pero filtrando por `userId` en lugar de `spaceId`.
6. **Máximo 3 reservas futuras:** Validado en `reservation.service.ts`. Se cuenta cuántas reservas `CONFIRMED` con fecha futura tiene el usuario.
7. **No reservar espacio desactivado:** Validado en `reservation.service.ts`. Si `space.isActive === false`, se rechaza.
8. **Precio calculado en el servidor:** El cliente NO envía el precio. El backend hace `(horas * space.pricePerHour)` y lo guarda en la BD.

## Cancelación

9. **Solo dueño o Admin:** Validado en el Route Handler (API). Se verifica `session.user.id === reservation.userId` o si el rol es ADMIN.
10. **Cancelar hasta 2 horas antes:** Validado en `reservation.service.ts`. Si `startTime - now < 2 horas`, se rechaza la cancelación.
11. **Soft Delete:** No se borra la fila de la BD. Solo se cambia `status = CANCELLED`.

## Espacios

12. **No se eliminan, se desactivan:** En el schema Prisma, `Space` tiene `isActive`. El admin solo puede hacer `UPDATE` de ese campo. No hay endpoint `DELETE`.
13. **No desactivar con reservas futuras:** Validado en `space.service.ts`. Antes de poner `isActive=false`, se cuentan las reservas `CONFIRMED` futuras de ese espacio. Si hay > 0, se rechaza.

## Seguridad

14. **No ver/modificar reservas ajenas:** Validado en el Route Handler. Si un usuario intenta cancelar la reserva de otro cambiando el `id` en la URL, el backend verifica que el `userId` coincida con la sesión y devuelve 403 Forbidden.
