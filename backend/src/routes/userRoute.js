import express from 'express';
import { authMe, test, updateProfile, changePassword, getUsers, toggleLikeSong, getFavoriteSongs } from '../controllers/userController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/me', protectedRoute, authMe);
router.put('/me', protectedRoute, updateProfile);
router.put('/me/password', protectedRoute, changePassword);
router.post('/like/:songId', protectedRoute, toggleLikeSong);
router.get('/favorites', protectedRoute, getFavoriteSongs);


router.get('/test', test);
// Admin:  list all users
router.get('/', protectedRoute, adminOnly, getUsers);


export default router;