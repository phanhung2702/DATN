import Playlist from "../models/Playlist.js";
import mongoose from "mongoose";

// Tạo Playlist mới
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl, isPublic } = req.body;
    const playlist = new Playlist({
      title,
      description,
      coverUrl,
      isPublic,
      creator: req.user._id,
      songs: []
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy toàn bộ Playlist công khai (Cho trang khám phá)
export const getPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate("creator", "username displayName")
      .sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy Playlist của riêng người dùng đang đăng nhập
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ creator: req.user._id });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 Playlist (Populate danh sách bài hát)
export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    // KIỂM TRA: Nếu ID không phải là định dạng MongoDB (ví dụ là chữ "create")
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Định dạng ID không hợp lệ" });
    }

    const playlist = await Playlist.findById(id)
      .populate("creator", "username displayName")
      .populate("songs"); 

    if (!playlist) return res.status(404).json({ message: "Không thấy playlist" });
    
    res.status(200).json(playlist);
  } catch (error) {
    // Trả về 400 hoặc 404 thay vì 500 để Frontend không bị crash
    res.status(400).json({ message: error.message });
  }
};

// Xóa Playlist (Thêm kiểm tra tồn tại)
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist không tồn tại" });

    if (String(playlist.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: "Không có quyền xóa playlist này" });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa Playlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm bài hát vào Playlist (Sửa lỗi crash nếu không tìm thấy playlist)
export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) return res.status(404).json({ message: "Không tìm thấy playlist" });

    if (String(playlist.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa" });
    }

    // Kiểm tra xem bài hát đã có trong playlist chưa (tránh trùng lặp)
    const songExists = playlist.songs.some(id => String(id) === String(songId));
    
    if (!songExists) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Xóa bài hát khỏi Playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);

    if (String(playlist.creator) !== String(req.user._id)) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    playlist.songs.pull(songId);
    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

