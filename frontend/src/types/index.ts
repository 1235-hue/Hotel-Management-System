export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'deluxe' | 'suite';
  status: 'available' | 'booked' | 'maintenance';
  price: number;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  users?: { name: string; email: string };
  rooms?: { number: string; type: string; price: number };
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  method: 'cash' | 'card' | 'mobile_money';
  status: 'paid' | 'pending';
  created_at: string;
}

export interface ReportData {
  rooms: { total: number; available: number; booked: number; maintenance: number };
  bookings: { total: number; confirmed: number; completed: number; cancelled: number };
  todayBookings: number;
  revenue: { total: number; paid: number; pending: number };
  totalUsers: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: { user: User; token: string };
}
