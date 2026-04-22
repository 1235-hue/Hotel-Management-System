const { supabaseAdmin } = require('../config/supabase');
const { successResponse, errorResponse } = require('../utils/helpers');

async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch users.');
  }
}

async function getUserById(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return errorResponse(res, 'User not found.', 404);
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, 'Failed to fetch user.');
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', req.params.id)
      .select('id, name, email, role')
      .single();

    if (error) throw error;
    return successResponse(res, data, 'User role updated.');
  } catch (err) {
    return errorResponse(res, 'Failed to update user role.');
  }
}

module.exports = { getAllUsers, getUserById, updateUserRole };
