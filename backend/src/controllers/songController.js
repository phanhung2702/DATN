import { count } from 'console';
import Song from '../models/Song.js';
import { url } from 'inspector';

export const createSong = async (req, res) => {
  try {
    const { title, artist, album, duration, audioUrl, coverUrl, genre, lyrics } = req.body;

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ message: 'Thiếu trường bắt buộc: title, artist hoặc audioUrl' });
    }

    const song = new Song({
      title,
      artist,
      album,
      duration,
      audioUrl,
      coverUrl,
      genre,
      lyrics,
      uploader: req.user ? req.user._id : undefined,
    });

    await song.save();
    return res.status(201).json({ song });
  } catch (error) {
    console.error('Error in createSong controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSongs = async (req, res) => {
  try {
    const { search, artist, genre, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(String(search), 'i');
      filter.$or = [{ title: regex }, { artist: regex }, { album: regex }];
    }

    if (artist) filter.artist = artist;
    if (genre) filter.genre = genre;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Song.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Song.countDocuments(filter),
    ]);

    return res.status(200).json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error in getSongs controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllSongsForAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Song.find().populate('uploader', '-hashedPassword').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Song.countDocuments(),
    ]);

    return res.status(200).json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Error in getAllSongsForAdmin controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    return res.status(200).json({ song });
  } catch (error) {
    console.error('Error in getSongById controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // allow only uploader or admin to update
    if (song.uploader && req.user && String(song.uploader) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = {};
    const fields = ['title', 'artist', 'album', 'duration', 'audioUrl', 'coverUrl', 'genre', 'lyrics'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Song.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json({ song: updated });
  } catch (error) {
    console.error('Error in updateSong controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    // 1. Kiểm tra quyền: chỉ uploader hoặc admin mới được xóa
    if (song.uploader && req.user && String(song.uploader) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // 2. Xóa file vật lý trong thư mục public/uploads nếu cần thiết
    const deleteFile = (url) => {
      if (url && url.includes('/uploads/')) {
        const filename = url.split('/uploads/')[1];
        const filePath = path.join(__dirname, '..', 'public', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      };

      deleteFile(song.audioUrl);
      deleteFile(song.coverUrl);
    }
      // 3.  Xóa trong database
    await Song.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Song deleted' });
  } catch (error) {
    console.error('Error in deleteSong controller:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchSongs = async (req, res) => {
  try {
    const { q, genre } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { artist: { $regex: q, $options: "i" } },
        { album: { $regex: q, $options: "i" } },
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    const songs = await Song.find(filter)
      .limit(20)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: songs.length,
      data: songs, // ✅ chuẩn FE
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Tăng lượt nghe (Gọi từ FE khi nhạc chạy được > 10s)
export const incrementPlayCount = async (req, res) => {
  try {
    await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy Top bài hát nghe nhiều nhất
export const getTopSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ plays: -1 }).limit(10);
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy bài hát liên quan (Cùng thể loại hoặc nghệ sĩ)
export const getRelatedSongs = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    const related = await Song.find({
      _id: { $ne: song._id },
      $or: [{ genre: song.genre }, { artist: song.artist }]
    }).limit(6);
    res.status(200).json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê cho Admin Dashboard
export const getAdminStats = async (req, res) => {
  try {
    const [totalSongs, totalPlays, genreStats] = await Promise.all([
      Song.countDocuments(),
      Song.aggregate([{ $group: { _id: null, total: { $sum: "$plays" } } }]),
      Song.aggregate([{ $group: { _id: "$genre", count: { $sum: 1 } } }])
    ]);

    res.status(200).json({
      totalSongs,
      totalPlays: totalPlays[0]?.total || 0,
      genreStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

