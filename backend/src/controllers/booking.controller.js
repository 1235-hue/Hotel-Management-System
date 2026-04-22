const { supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

async function getAllBookings(req, res) {
  try {
    let query = supabaseAdmin
      .from('bookings')
      .select('*, users(name, email), rooms(number, type, price)')
      .order('created_at', { ascending: false });

    // Customers can only view their own bookings.
    if (req.user?.role === 'customer') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch bookings.');
  }
}

async function getBookingById(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*, users(name, email), rooms(number, type, price)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return errorResponse(res, 'Booking not found.', 404);
    if (req.user?.role === 'customer' && data.user_id !== req.user.id) {
      return errorResponse(res, 'Access denied.', 403);
    }
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch booking.');
  }
}

async function createBooking(req, res) {
  try {
    const { user_id, room_id, check_in, check_out } = req.body;
    const bookingUserId = req.user?.role === 'customer' ? req.user.id : (user_id || req.user.id);

    // Validate dates
    if (new Date(check_in) >= new Date(check_out)) {
      return errorResponse(res, 'Check-out must be after check-in.', 400);
    }
    if (new Date(check_in) < new Date()) {
      return errorResponse(res, 'Check-in date cannot be in the past.', 400);
    }

    // IMPORTANT: Prevent double booking - check overlapping dates for same room
    const { data: overlapping, error: overlapErr } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .neq('status', 'cancelled')
      .lt('check_in', check_out)   // existing check_in < new check_out
      .gt('check_out', check_in);  // existing check_out > new check_in

    if (overlapErr) throw overlapErr;

    if (overlapping && overlapping.length > 0) {
      return errorResponse(res, 'Room is already booked for the selected dates.', 409);
    }

    // Create booking
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: bookingUserId,
        room_id,
        check_in,
        check_out,
        status: 'confirmed',
      })
      .select('*, rooms(number, type, price)')
      .single();

    if (error) throw error;

    // Update room status to booked
    await supabaseAdmin.from('rooms').update({ status: 'booked' }).eq('id', room_id);

    return successResponse(res, data, 'Booking created.', 201);
  } catch (err) {
    console.error('Booking error:', err);
    return errorResponse(res, 'Failed to create booking.');
  }
}

async function updateBooking(req, res) {
  try {
    const { status } = req.body;

    const { data: existingBooking, error: existingError } = await supabaseAdmin
      .from('bookings')
      .select('id, user_id')
      .eq('id', req.params.id)
      .single();

    if (existingError || !existingBooking) {
      return errorResponse(res, 'Booking not found.', 404);
    }
    if (req.user?.role === 'customer' && existingBooking.user_id !== req.user.id) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', req.params.id)
      .select('*, rooms(id, number)')
      .single();

    if (error) throw error;

    // If cancelled, free up the room
    if (status === 'cancelled' && data.rooms) {
      await supabaseAdmin.from('rooms').update({ status: 'available' }).eq('id', data.rooms.id);
    }

    return successResponse(res, data, 'Booking updated.');
  } catch (err) {
    return errorResponse(res, 'Failed to update booking.');
  }
}

async function deleteBooking(req, res) {
  try {
    // Get booking to free room
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('room_id, user_id')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return errorResponse(res, 'Booking not found.', 404);
    }
    if (req.user?.role === 'customer' && booking.user_id !== req.user.id) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const { error } = await supabaseAdmin.from('bookings').delete().eq('id', req.params.id);
    if (error) throw error;

    if (booking) {
      await supabaseAdmin.from('rooms').update({ status: 'available' }).eq('id', booking.room_id);
    }

    return successResponse(res, null, 'Booking deleted.');
  } catch (err) {
    return errorResponse(res, 'Failed to delete booking.');
  }
}

module.exports = { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking };
