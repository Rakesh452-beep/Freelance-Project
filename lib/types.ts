export type ServiceId = "photography" | "cinematography" | "graphic-design";

export interface ServiceEventType {
  id: string;
  label: string;
  priceFrom: number;
  advance: number;
  note?: string;
  quoteOnly?: boolean;
}

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  priceFrom: number;
  priceNote?: string;
  depositPct: number;
  duration: string;
  eventTypes: ServiceEventType[];
}

export type PaymentStatus = "pending" | "paid" | "failed";

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  booking_ref: string;
  service: ServiceId;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string;
  event_time: string;
  location: string;
  notes: string | null;
  amount: number;
  advance_amount: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface BookingPayload {
  service: ServiceId;
  event_type_id: string;
  event_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_date: string;
  event_time: string;
  location: string;
  notes?: string;
  payNow: boolean;
}
