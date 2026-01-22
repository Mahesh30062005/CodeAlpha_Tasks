module.exports = (req, res, next) => {
  // req.user comes from the previous verifyToken step
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Admins Only' });
  }
  next();
};