import express from 'express';
import { createSong, getSongs, getSongById, updateSong, deleteSong, getAllSongsForAdmin, searchSongs, getAdminStats, getRelatedSongs, incrementPlayCount, getTopSongs } from '../controllers/songController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// createSong now restricted to admins only
router.post('/', protectedRoute, adminOnly, createSong);
router.get('/', getSongs);
router.get('/top', protectedRoute, getTopSongs);
router.get('/search', protectedRoute,searchSongs);
// Admin: list all songs with uploader info
router.get('/admin', protectedRoute, adminOnly, getAllSongsForAdmin);
router.get('/:id', getSongById);
router.put('/:id', protectedRoute, updateSong);
router.delete('/:id', protectedRoute, deleteSong);
router.get('/:id/related', protectedRoute, getRelatedSongs);
router.post('/:id/play', protectedRoute, incrementPlayCount);

router.get('/admin/stats', protectedRoute, adminOnly, getAdminStats);

export default router;
