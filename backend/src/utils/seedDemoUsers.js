const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

const DEMO_PASSWORD = '123456';

const DEMO_USERS = [
  { name: 'Customer Test', email: 'customer@gmail.com', role: 'customer' },
  { name: 'Staff Test', email: 'staff@gmail.com', role: 'staff' },
  { name: 'Admin Test', email: 'admin@gmail.com', role: 'admin' },
];

async function ensureDemoUsers() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);

  const payload = DEMO_USERS.map((user) => ({
    ...user,
    password: hashedPassword,
  }));

  const { error } = await supabaseAdmin
    .from('users')
    .upsert(payload, { onConflict: 'email' });

  if (error) {
    throw error;
  }
}

module.exports = { ensureDemoUsers, DEMO_USERS, DEMO_PASSWORD };