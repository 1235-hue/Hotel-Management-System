const app = require('./src/app');
const dotenv = require('dotenv');
const { ensureDemoUsers } = require('./src/utils/seedDemoUsers');
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await ensureDemoUsers();
    console.log('Seeded role test users (admin/staff/customer).');
  } catch (error) {
    console.error('Failed to seed demo users:', error.message || error);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DEPLOYMENT SUCCESSFUL`);
    console.log(`🏨 Server listening on port ${PORT}`);
  });
}

startServer();
