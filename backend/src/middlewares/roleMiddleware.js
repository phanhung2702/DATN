export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
  } catch (error) {
    console.error('Error in adminOnly middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
