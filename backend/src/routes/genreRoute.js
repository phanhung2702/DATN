import express from 'express';
import { createGenre, getGenres, getGenreById, updateGenre, deleteGenre } from '../controllers/genreController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/', protectedRoute, adminOnly, createGenre);
router.get('/', getGenres);
router.get('/:id', getGenreById);
router.put('/:id', protectedRoute, adminOnly, updateGenre);
router.delete('/:id', protectedRoute, adminOnly, deleteGenre);

export default router;
