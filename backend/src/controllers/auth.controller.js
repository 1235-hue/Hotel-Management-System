const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * POST /api/auth/register
 * Register a new user. Default role: 'customer'.
 */
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return errorResponse(res, 'Email already registered.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        role: role || 'customer',
      })
      .select('id, name, email, role, created_at')
      .single();

    if (error) throw error;

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(res, { user, token }, 'Registration successful.', 201);
  } catch (err) {
    console.error('Register error:', err);
    return errorResponse(res, 'Registration failed.');
  }
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;
    return successResponse(res, { user: userWithoutPassword, token }, 'Login successful.');
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 'Login failed.');
  }
}

module.exports = { register, login };
