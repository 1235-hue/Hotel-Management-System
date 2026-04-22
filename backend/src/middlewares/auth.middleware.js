const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware: Verify JWT token from Authorization header.
 * Attaches decoded user to req.user
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Access denied. No token provided.', 401);
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token.', 401);
  }
}

module.exports = { authenticate };
