import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { ReportData } from '../../types';

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports').then(res => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  if (!data) return <p className="text-gray-500">Failed to load reports.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-hotel-dark mb-8">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Room Summary</h2>
          <table className="w-full">
            <tbody className="divide-y">
              <tr><td className="py-2 text-gray-600">Total Rooms</td><td className="py-2 font-bold text-right">{data.rooms.total}</td></tr>
              <tr><td className="py-2 text-gray-600">Available</td><td className="py-2 font-bold text-right text-green-600">{data.rooms.available}</td></tr>
              <tr><td className="py-2 text-gray-600">Booked</td><td className="py-2 font-bold text-right text-amber-600">{data.rooms.booked}</td></tr>
              <tr><td className="py-2 text-gray-600">Maintenance</td><td className="py-2 font-bold text-right text-red-600">{data.rooms.maintenance}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
          <table className="w-full">
            <tbody className="divide-y">
              <tr><td className="py-2 text-gray-600">Total Bookings</td><td className="py-2 font-bold text-right">{data.bookings.total}</td></tr>
              <tr><td className="py-2 text-gray-600">Confirmed</td><td className="py-2 font-bold text-right text-green-600">{data.bookings.confirmed}</td></tr>
              <tr><td className="py-2 text-gray-600">Completed</td><td className="py-2 font-bold text-right text-blue-600">{data.bookings.completed}</td></tr>
              <tr><td className="py-2 text-gray-600">Cancelled</td><td className="py-2 font-bold text-right text-red-600">{data.bookings.cancelled}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue</h2>
          <table className="w-full">
            <tbody className="divide-y">
              <tr><td className="py-2 text-gray-600">Total Revenue</td><td className="py-2 font-bold text-right">${data.revenue.total.toLocaleString()}</td></tr>
              <tr><td className="py-2 text-gray-600">Paid</td><td className="py-2 font-bold text-right text-green-600">${data.revenue.paid.toLocaleString()}</td></tr>
              <tr><td className="py-2 text-gray-600">Pending</td><td className="py-2 font-bold text-right text-amber-600">${data.revenue.pending.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <table className="w-full">
            <tbody className="divide-y">
              <tr><td className="py-2 text-gray-600">Today's Bookings</td><td className="py-2 font-bold text-right">{data.todayBookings}</td></tr>
              <tr><td className="py-2 text-gray-600">Total Users</td><td className="py-2 font-bold text-right">{data.totalUsers}</td></tr>
              <tr><td className="py-2 text-gray-600">Occupancy Rate</td>
                <td className="py-2 font-bold text-right">
                  {data.rooms.total > 0 ? Math.round((data.rooms.booked / data.rooms.total) * 100) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
