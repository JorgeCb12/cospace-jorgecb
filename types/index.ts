export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  pricePerHour: string | number;
  imageUrl: string;
  isActive: boolean;
}

export type ReservationStatus = "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  totalPrice: string | number;
  status: ReservationStatus;
  space: Space;
}
