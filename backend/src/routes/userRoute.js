import express from 'express';
import { authMe, updateProfile, changePassword, getUsers } from '../controllers/userController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/me', protectedRoute, authMe);
router.put('/me', protectedRoute, updateProfile);
router.put('/me/password', protectedRoute, changePassword);
// Admin: list all users
router.get('/', protectedRoute, adminOnly, getUsers);


export default router;