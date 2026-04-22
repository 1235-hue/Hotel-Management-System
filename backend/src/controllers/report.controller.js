const { supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

async function getReports(req, res) {
  try {
    // Total rooms by status
    const { data: rooms } = await supabaseAdmin.from('rooms').select('status');
    const roomStats = {
      total: rooms?.length || 0,
      available: rooms?.filter(r => r.status === 'available').length || 0,
      booked: rooms?.filter(r => r.status === 'booked').length || 0,
      maintenance: rooms?.filter(r => r.status === 'maintenance').length || 0,
    };

    // Bookings stats
    const { data: bookings } = await supabaseAdmin.from('bookings').select('status, created_at');
    const bookingStats = {
      total: bookings?.length || 0,
      confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
      completed: bookings?.filter(b => b.status === 'completed').length || 0,
      cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
    };

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const { data: todayBookings } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .gte('created_at', today);
    
    // Revenue
    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('amount, status');
    const revenue = {
      total: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      paid: payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0,
      pending: payments?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0,
    };

    // Users count
    const { count: userCount } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true });

    return successResponse(res, {
      rooms: roomStats,
      bookings: bookingStats,
      todayBookings: todayBookings?.length || 0,
      revenue,
      totalUsers: userCount || 0,
    });
  } catch (err) {
    console.error('Report error:', err);
    return errorResponse(res, 'Failed to generate reports.');
  }
}

module.exports = { getReports };
