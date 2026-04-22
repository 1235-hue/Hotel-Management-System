-- ============================================
-- HOTEL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- PostgreSQL / Supabase
-- ============================================

-- 1. USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. ROOMS TABLE
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number VARCHAR(10) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'double', 'deluxe', 'suite')),
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'maintenance')),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_type ON rooms(type);

-- 3. BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_room ON bookings(room_id);
CREATE INDEX idx_bookings_dates ON bookings(room_id, check_in, check_out);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Prevent double bookings at the database level (exclusion constraint)
-- NOTE: Requires btree_gist extension in Supabase
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings ADD CONSTRAINT no_double_booking
  EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out) WITH &&
  )
  WHERE (status != 'cancelled');

-- 4. PAYMENTS TABLE
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  method VARCHAR(20) NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'card', 'mobile_money')),
  status VARCHAR(20) NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Role dashboard test users (password: "123456" for all)
-- bcrypt("123456") => $2a$12$MMKGv6QVfDMSCZ7S8i.5ceBccIyuEp9YN9dYkfd0qxw2prYjxo2mW
INSERT INTO users (name, email, password, role) VALUES
  ('Customer Test', 'customer@gmail.com', '$2a$12$MMKGv6QVfDMSCZ7S8i.5ceBccIyuEp9YN9dYkfd0qxw2prYjxo2mW', 'customer'),
  ('Staff Test', 'staff@gmail.com', '$2a$12$MMKGv6QVfDMSCZ7S8i.5ceBccIyuEp9YN9dYkfd0qxw2prYjxo2mW', 'staff'),
  ('Admin Test', 'admin@gmail.com', '$2a$12$MMKGv6QVfDMSCZ7S8i.5ceBccIyuEp9YN9dYkfd0qxw2prYjxo2mW', 'admin')
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  password = EXCLUDED.password,
  role = EXCLUDED.role;

-- Rooms
INSERT INTO rooms (number, type, status, price) VALUES
  ('101', 'single', 'available', 75.00),
  ('102', 'single', 'available', 75.00),
  ('201', 'double', 'available', 120.00),
  ('202', 'double', 'booked', 120.00),
  ('301', 'deluxe', 'available', 200.00),
  ('302', 'deluxe', 'maintenance', 200.00),
  ('401', 'suite', 'available', 350.00),
  ('402', 'suite', 'booked', 350.00);
