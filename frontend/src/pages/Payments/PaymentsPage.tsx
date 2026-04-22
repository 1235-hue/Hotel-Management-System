import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Payment } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ booking_id: '', amount: '', method: 'cash' });
  const [loading, setLoading] = useState(false);

  const fetchPayments = () => {
    api.get('/payments').then(res => setPayments(res.data.data)).catch(() => toast.error('Failed to load payments'));
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/payments', { ...form, amount: parseFloat(form.amount) });
      toast.success('Payment recorded');
      setShowForm(false);
      setForm({ booking_id: '', amount: '', method: 'cash' });
      fetchPayments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-hotel-dark">Payments</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          {showForm ? 'Close' : 'Record Payment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <input type="text" value={form.booking_id} onChange={e => setForm({ ...form, booking_id: e.target.value })} required
              placeholder="UUID of the booking" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input type="number" step="0.01" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required
              className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Method</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 capitalize">{p.method.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(p.created_at), 'MMM dd, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="text-center text-gray-400 py-8">No payments found</p>}
      </div>
    </div>
  );
}
