import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import type { Room } from '../../types';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  booked: 'bg-amber-100 text-amber-700',
  maintenance: 'bg-red-100 text-red-700',
};

export default function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState({ status: '', type: '' });
  const { user } = useAuthStore();
  const canEdit = user?.role === 'admin' || user?.role === 'staff';

  const fetchRooms = () => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.type) params.set('type', filter.type);
    api.get(`/rooms?${params}`).then(res => setRooms(res.data.data));
  };

  useEffect(() => { fetchRooms(); }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch { toast.error('Failed to delete room'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-hotel-dark">Rooms</h1>
        {canEdit && (
          <Link to="/rooms/new" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" /> Add Room
          </Link>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 border rounded-lg">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
          className="px-3 py-2 border rounded-lg">
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">Room {room.number}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[room.status]}`}>
                {room.status}
              </span>
            </div>
            <p className="text-gray-500 capitalize mb-1">{room.type}</p>
            <p className="text-2xl font-bold text-primary-600">${room.price}<span className="text-sm text-gray-400">/night</span></p>
            {canEdit && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Link to={`/rooms/${room.id}/edit`} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <button onClick={() => handleDelete(room.id)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 ml-auto">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
