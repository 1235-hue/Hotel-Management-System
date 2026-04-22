const { errorResponse } = require('../utils/helpers');

/**
 * Middleware factory: Restrict access to specific roles
 * @param  {...string} allowedRoles - e.g. 'admin', 'staff'
 * Usage: authorize('admin', 'staff')
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Insufficient permissions.', 403);
    }
    next();
  };
}

module.exports = { authorize };
