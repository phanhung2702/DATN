import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectedRoute = (req, res, next) => {
  // exempt public static uploads and upload endpoint
//   if (req.path.startsWith('/uploads') || req.path.startsWith('/api/uploads') || req.path.startsWith('/api/upload')) {
//     return next();
//   }

  try {
      // lấy token từ header
      const authHeader = req.headers['authorization'] || '';
      
      // kiểm tra định dạng Bearer token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Access token not found or invalid format' });
      }

      const token = authHeader.split(' ')[1];  // Bearer <token>

      if (!token) {
          return res.status(401).json({ message: 'Access token not found' });
      }
      
      // xác nhận token hợp lệ
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
          if (err) {
              console.error('JWT Error:', err.message);
              return res.status(403).json({ message: 'Access token is invalid or expired' });
          }
          // tìm user
          const user = await User.findById(decoded.userId).select('-hashedPassword');
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // trả user về trong req
          req.user = user;
          next();
      });
  } catch (error) {
      console.error('Error in auth middleware:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};