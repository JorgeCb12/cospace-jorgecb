# Contratos de Endpoints de CoSpace

## Convenciones

- **Base URL:** `/api`
- **Autenticación:** Gestionada por Better Auth en `/api/auth/[...all]` (cookies `httpOnly`).
- **Formato de error estandarizado:**

```json
{ "error": { "code": "ERROR_CODE", "message": "Descripción del error" } }
```

### Códigos HTTP

| Código | Significado                          |
| ------ | ------------------------------------ |
| `400`  | Bad Request / Validación             |
| `401`  | No autenticado                       |
| `403`  | Prohibido / Sin permisos             |
| `404`  | No encontrado                        |
| `409`  | Conflicto / Regla de negocio violada |

## 1. Autenticación

Gestionado automáticamente por Better Auth via el catch-all `app/api/auth/[...all]/route.ts`.

| Método | Ruta                      | Descripción               |
| ------ | ------------------------- | ------------------------- |
| `POST` | `/api/auth/sign-up/email` | Registro de nuevo usuario |
| `POST` | `/api/auth/sign-in/email` | Inicio de sesión          |
| `POST` | `/api/auth/sign-out`      | Cierre de sesión          |
| `GET`  | `/api/auth/get-session`   | Obtener sesión actual     |

## 2. Espacios (Spaces)

### `GET /api/spaces`

- **Acceso:** Público (SSR Catálogo)
- **Query params:** Ninguno (retorna todos los activos)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "string",
      "name": "Sala Juntas",
      "pricePerHour": "25.00",
      "imageUrl": "url"
    }
  ]
}
```

---

### `GET /api/spaces/[id]`

- **Acceso:** Público (SSR Detalle)

**Response `200`:**

```json
{
  "id": "string",
  "name": "Sala Juntas",
  "description": "...",
  "pricePerHour": "25.00",
  "imageUrl": "url",
  "isActive": true
}
```

**Errores:** `404 SPACE_NOT_FOUND`

---

### `POST /api/admin/spaces`

- **Acceso:** Solo `ADMIN` (valida rol en el handler)

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "pricePerHour": "number",
  "imageUrl": "string"
}
```

**Response `201`:** Datos del espacio creado.

**Errores:** `400 VALIDATION_ERROR` · `401 UNAUTHORIZED` · `403 FORBIDDEN`

---

### `PATCH /api/admin/spaces/[id]`

- **Acceso:** Solo `ADMIN`
- **Request Body:** Cualquier campo editable (`name`, `description`, `pricePerHour`)

**Response `200`:** Espacio actualizado.

**Errores:** `400` · `401` · `403` · `404 SPACE_NOT_FOUND`

---

### `PATCH /api/admin/spaces/[id]/deactivate`

- **Acceso:** Solo `ADMIN`
- **Request Body:** Ninguno
- **Comportamiento:** Cambia `isActive` a `false`

**Errores:** `409 SPACE_HAS_FUTURE_RESERVATIONS` (Regla 13)

## 3. Reservas (Reservations)

### `GET /api/reservations`

- **Acceso:** Privado (usuario autenticado)
- **Comportamiento:** Devuelve solo las reservas del usuario logueado (Regla 14)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "string",
      "startTime": "ISO",
      "endTime": "ISO",
      "totalPrice": "50.00",
      "status": "CONFIRMED",
      "space": { "name": "Sala Juntas" }
    }
  ]
}
```

**Errores:** `401 UNAUTHORIZED`

---

### `POST /api/reservations`

- **Acceso:** Privado (usuario autenticado)
- **Comportamiento:** Valida las reglas 1–8 en `services/reservation.service.ts`. El precio **no** se envía — se calcula en el backend.

**Request Body:**

```json
{ "spaceId": "string", "startTime": "ISO-Date", "endTime": "ISO-Date" }
```

**Response `201`:**

```json
{
  "id": "string",
  "message": "Reserva creada exitosamente",
  "totalPrice": "50.00"
}
```

**Errores:**

| Código | Error                      | Descripción                                          |
| ------ | -------------------------- | ---------------------------------------------------- |
| `400`  | `VALIDATION_ERROR`         | Fechas mal formadas o minutos ≠ 00                   |
| `401`  | `UNAUTHORIZED`             | Usuario no autenticado                               |
| `404`  | `SPACE_NOT_FOUND`          | Espacio no existe                                    |
| `409`  | `INVALID_DURATION`         | Duración fuera del rango 1–4 horas                   |
| `409`  | `OUTSIDE_OPERATING_HOURS`  | Fuera del horario 7:00–21:00                         |
| `409`  | `INVALID_PAST_DATE`        | Fecha en el pasado                                   |
| `409`  | `TOO_FAR_IN_ADVANCE`       | Más de 30 días en el futuro                          |
| `409`  | `SPACE_INACTIVE`           | Espacio desactivado (Regla 7)                        |
| `409`  | `SPACE_OVERLAP`            | Conflicto con otra reserva en el espacio (Regla 4)   |
| `409`  | `USER_OVERLAP`             | El usuario ya tiene reserva en ese horario (Regla 5) |
| `409`  | `MAX_RESERVATIONS_REACHED` | Límite de reservas activas alcanzado (Regla 6)       |

---

### `PATCH /api/reservations/[id]/cancel`

- **Acceso:** Privado (dueño de la reserva o `ADMIN`)
- **Comportamiento:** Valida reglas 9, 10 y 11. Cambia el estado a `CANCELLED` sin borrar el registro.

**Response `200`:**

```json
{ "message": "Reserva cancelada exitosamente" }
```

**Errores:**

| Código | Error                   | Descripción                             |
| ------ | ----------------------- | --------------------------------------- |
| `401`  | `UNAUTHORIZED`          | Usuario no autenticado                  |
| `403`  | `FORBIDDEN`             | No es el dueño de la reserva (Regla 14) |
| `404`  | `RESERVATION_NOT_FOUND` | Reserva no existe                       |
| `409`  | `TOO_LATE_TO_CANCEL`    | Faltan menos de 2 horas para el inicio  |
