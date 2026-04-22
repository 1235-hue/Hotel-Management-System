import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ number: '', type: 'single', status: 'available', price: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/rooms/${id}`).then(res => {
        const r = res.data.data;
        setForm({ number: r.number, type: r.type, status: r.status, price: String(r.price) });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (isEdit) {
        await api.put(`/rooms/${id}`, payload);
        toast.success('Room updated');
      } else {
        await api.post('/rooms', payload);
        toast.success('Room created');
      }
      navigate('/rooms');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold text-hotel-dark mb-6">{isEdit ? 'Edit Room' : 'New Room'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
          <input type="text" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg">
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg">
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
          <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
          </button>
          <button type="button" onClick={() => navigate('/rooms')} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
