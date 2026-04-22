const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Management System API',
      version: '1.0.0',
      description: 'Complete REST API for Hotel Management with authentication, rooms, bookings, payments, and reports.',
    },
    // UPDATED: Added the production server URL
    servers: [
      { 
        url: 'https://hotel-management-system-7v0i.onrender.com', 
        description: 'Production Server (Render)' 
      },
      { 
        url: 'http://localhost:5000', 
        description: 'Development Server (Local)' 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        // ... (Keep your existing schemas: User, Room, Booking, Payment)
      },
    },
    paths: {
      // ... (Keep your existing paths)
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);