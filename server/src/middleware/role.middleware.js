// src/middleware/role.middleware.js

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware ले req.user inject नगरेको case
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // role check
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

export default authorizeRoles;
