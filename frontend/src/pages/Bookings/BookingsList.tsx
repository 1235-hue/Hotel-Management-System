import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { Booking } from '../../types';
import toast from 'react-hot-toast';
import { Plus, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = () => {
    api.get('/bookings').then(res => setBookings(res.data.data)).catch(() => toast.error('Failed to load bookings'));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}`, { status: 'cancelled' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-hotel-dark">Bookings</h1>
        <Link to="/bookings/new" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> New Booking
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Guest</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Room</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Check In</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Check Out</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{b.users?.name || '—'}</td>
                <td className="px-6 py-4 text-sm">Room {b.rooms?.number} ({b.rooms?.type})</td>
                <td className="px-6 py-4 text-sm">{format(new Date(b.check_in), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 text-sm">{format(new Date(b.check_out), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[b.status]}`}>{b.status}</span>
                </td>
                <td className="px-6 py-4">
                  {b.status === 'confirmed' && (
                    <button onClick={() => cancelBooking(b.id)} className="text-red-500 hover:text-red-700">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings found</p>}
      </div>
    </div>
  );
}
