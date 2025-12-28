import express from 'express';
import { createSong, getSongs, getSongById, updateSong, deleteSong, getAllSongsForAdmin } from '../controllers/songController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// createSong now restricted to admins only
router.post('/', protectedRoute, adminOnly, createSong);
router.get('/', getSongs);
// Admin: list all songs with uploader info
router.get('/admin', protectedRoute, adminOnly, getAllSongsForAdmin);
router.get('/:id', getSongById);
router.put('/:id', protectedRoute, updateSong);
router.delete('/:id', protectedRoute, deleteSong);

export default router;
