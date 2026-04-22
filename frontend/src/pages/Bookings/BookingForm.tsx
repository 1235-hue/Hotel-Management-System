import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Room } from '../../types';
import toast from 'react-hot-toast';

export default function BookingForm() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState({ room_id: '', check_in: '', check_out: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/rooms?status=available').then(res => setRooms(res.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(form.check_in) >= new Date(form.check_out)) {
      return toast.error('Check-out must be after check-in');
    }
    setLoading(true);
    try {
      await api.post('/bookings', form);
      toast.success('Booking created!');
      navigate('/bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold text-hotel-dark mb-6">New Booking</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
          <select value={form.room_id} onChange={e => setForm({ ...form, room_id: e.target.value })} required
            className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select a room</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>Room {r.number} - {r.type} (${r.price}/night)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
          <input type="date" value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })} required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
          <input type="date" value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })} required
            min={form.check_in || new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Booking...' : 'Create Booking'}
          </button>
          <button type="button" onClick={() => navigate('/bookings')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
