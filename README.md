# 🏨 Hotel Management System

A full-stack Hotel Management System with React frontend and Express.js backend, using PostgreSQL (Supabase) as the database.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, Axios |
| Backend | Node.js, Express.js, JWT, bcrypt |
| Database | PostgreSQL (Supabase) |
| Docs | Swagger UI |

## Project Structure

```
hotel-management-system/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Express.js REST API
├── database.sql       # SQL schema + sample data
└── README.md
```

## Quick Start

### 1. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `database.sql`
3. Copy your project URL and keys from **Settings > API**

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your Supabase credentials:
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-strong-secret-key
```

Start the server:
```bash
npm run dev
```

API docs available at: `http://localhost:5000/api-docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:3000` (proxies `/api` calls to `http://localhost:5000`)

For online/frontend deployments (for example Vercel), set:
```
VITE_API_URL=https://your-backend-domain/api
```
This ensures login/register and all API requests target your deployed backend.

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | 123456 |
| Staff | staff@gmail.com | 123456 |
| Customer | customer@gmail.com | 123456 |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/rooms` | ❌ | List rooms (filterable) |
| POST | `/api/rooms` | 🔒 Admin/Staff | Create room |
| PUT | `/api/rooms/:id` | 🔒 Admin/Staff | Update room |
| DELETE | `/api/rooms/:id` | 🔒 Admin | Delete room |
| GET | `/api/bookings` | 🔒 | List bookings |
| POST | `/api/bookings` | 🔒 | Create booking |
| PUT | `/api/bookings/:id` | 🔒 | Update booking |
| DELETE | `/api/bookings/:id` | 🔒 | Delete booking |
| GET | `/api/payments` | 🔒 Admin/Staff | List payments |
| POST | `/api/payments` | 🔒 | Record payment |
| GET | `/api/reports` | 🔒 Admin/Staff | Dashboard stats |

## Key Features

- ✅ JWT authentication with role-based access (admin, staff, customer)
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ **Double-booking prevention** (app-level + database exclusion constraint)
- ✅ Room CRUD with status and type filtering
- ✅ Booking system with date validation
- ✅ Payment recording (cash, card, mobile money)
- ✅ Dashboard with real-time stats and revenue reports
- ✅ Swagger API documentation
- ✅ Input validation with express-validator
- ✅ Global error handling middleware
- ✅ Responsive Tailwind CSS UI with sidebar navigation

## Architecture Notes

- **Auth flow**: Register → bcrypt hash → store in DB → JWT token returned. Login verifies password → returns JWT.
- **Double booking**: Checked at both application level (overlapping date query) AND database level (PostgreSQL exclusion constraint using `daterange`).
- **Role middleware**: `authorize('admin', 'staff')` restricts endpoints by role.
- **API interceptor**: Frontend automatically attaches JWT and handles 401 (auto-logout).
