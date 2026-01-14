import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
  createPlaylist,
  getPublicPlaylists,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/public", getPublicPlaylists);
router.get("/my-playlists", protectedRoute, getUserPlaylists);
router.get("/:id", getPlaylistById);

router.post("/", protectedRoute, createPlaylist);
router.post("/add-song", protectedRoute, addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", protectedRoute, removeSongFromPlaylist);
router.delete("/:id", protectedRoute, deletePlaylist);

export default router;