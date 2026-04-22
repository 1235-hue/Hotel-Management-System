import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { useAuthStore } from '../store/authStore';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import RoomsList from '../pages/Rooms/RoomsList';
import RoomForm from '../pages/Rooms/RoomForm';
import BookingsList from '../pages/Bookings/BookingsList';
import BookingForm from '../pages/Bookings/BookingForm';
import PaymentsPage from '../pages/Payments/PaymentsPage';
import ReportsPage from '../pages/Reports/ReportsPage';

function DashboardRedirect() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user.role === 'staff') return <Navigate to="/dashboard/staff" replace />;

  return <Navigate to="/dashboard/customer" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRedirect />} />
        <Route path="dashboard/admin" element={<ProtectedRoute roles={['admin']}><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard/staff" element={<ProtectedRoute roles={['staff']}><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard/customer" element={<ProtectedRoute roles={['customer']}><Dashboard /></ProtectedRoute>} />
        <Route path="rooms" element={<RoomsList />} />
        <Route path="rooms/new" element={<ProtectedRoute roles={['admin', 'staff']}><RoomForm /></ProtectedRoute>} />
        <Route path="rooms/:id/edit" element={<ProtectedRoute roles={['admin', 'staff']}><RoomForm /></ProtectedRoute>} />
        <Route path="bookings" element={<BookingsList />} />
        <Route path="bookings/new" element={<BookingForm />} />
        <Route path="payments" element={<ProtectedRoute roles={['admin', 'staff']}><PaymentsPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={['admin', 'staff']}><ReportsPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
