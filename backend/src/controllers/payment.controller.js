const { supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

async function getAllPayments(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*, bookings(id, check_in, check_out, users(name, email))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch payments.');
  }
}

async function createPayment(req, res) {
  try {
    const { booking_id, amount, method, status } = req.body;

    // Verify booking exists
    const { data: booking, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('id, status')
      .eq('id', booking_id)
      .single();

    if (bErr || !booking) return errorResponse(res, 'Booking not found.', 404);
    if (booking.status === 'cancelled') return errorResponse(res, 'Cannot pay for a cancelled booking.', 400);

    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert({
        booking_id,
        amount,
        method: method || 'cash',
        status: status || 'paid',
      })
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, data, 'Payment recorded.', 201);
  } catch (err) {
    return errorResponse(res, 'Failed to record payment.');
  }
}

module.exports = { getAllPayments, createPayment };
