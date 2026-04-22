const { supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

async function getAllRooms(req, res) {
  try {
    const { status, type } = req.query;
    let query = supabaseAdmin.from('rooms').select('*').order('number');

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const { data, error } = await query;
    if (error) throw error;
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch rooms.');
  }
}

async function getRoomById(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return errorResponse(res, 'Room not found.', 404);
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch room.');
  }
}

async function createRoom(req, res) {
  try {
    const { number, type, status, price } = req.body;
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .insert({ number, type, status: status || 'available', price })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return errorResponse(res, 'Room number already exists.', 409);
      throw error;
    }
    return successResponse(res, data, 'Room created.', 201);
  } catch (err) {
    return errorResponse(res, 'Failed to create room.');
  }
}

async function updateRoom(req, res) {
  try {
    const { number, type, status, price } = req.body;
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .update({ number, type, status, price })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, data, 'Room updated.');
  } catch (err) {
    return errorResponse(res, 'Failed to update room.');
  }
}

async function deleteRoom(req, res) {
  try {
    const { error } = await supabaseAdmin
      .from('rooms')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    return successResponse(res, null, 'Room deleted.');
  } catch (err) {
    return errorResponse(res, 'Failed to delete room.');
  }
}

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
