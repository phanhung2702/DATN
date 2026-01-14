import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Session from '../models/Session.js';

export const authMe = (req, res) => {
    try {
       const user = req.user;
       return res.status(200).json({ user });
    } catch (error) {
        console.error('Error in authMe controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateProfile = async (req, res) => {
    try {
        // req.user được gán bởi middleware bảo vệ
        const currentUser = req.user;

        if (!currentUser || !currentUser._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { displayName, email, avatarUrl } = req.body;

        const updates = {};
        if (displayName) updates.displayName = displayName;
        if (avatarUrl) updates.avatarUrl = avatarUrl;

        if (email) {
            const normalizedEmail = String(email).trim().toLowerCase();
            if (normalizedEmail !== (currentUser.email || '').toLowerCase()) {
                const existing = await User.findOne({ email: normalizedEmail });
                if (existing && String(existing._id) !== String(currentUser._id)) {
                    return res.status(400).json({ message: 'Email đã được sử dụng bởi người dùng khác' });
                }
                updates.email = normalizedEmail;
            }
        }

        // Nếu không có trường nào để cập nhật
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Không có dữ liệu hợp lệ để cập nhật' });
        }

        const updatedUser = await User.findByIdAndUpdate(currentUser._id, updates, { new: true }).select('-hashedPassword');
        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error('Error in updateProfile controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser || !currentUser._id) return res.status(401).json({ message: 'Unauthorized' });

        const { currentPassword, newPassword, newPasswordConfirm } = req.body;
        if (!currentPassword || !newPassword || !newPasswordConfirm) return res.status(400).json({ message: 'currentPassword, newPassword and newPasswordConfirm are required' });
        if (String(newPassword).length < 6) return res.status(400).json({ message: 'newPassword must be at least 6 characters' });
        if (String(newPassword) !== String(newPasswordConfirm)) return res.status(400).json({ message: 'newPassword and newPasswordConfirm do not match' });

        const user = await User.findById(currentUser._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(String(newPassword), 10);
        user.hashedPassword = hashed;
        await user.save();

        // Invalidate existing sessions so user must sign in again
        await Session.deleteMany({ userId: user._id });

        return res.status(200).json({ message: 'Password changed successfully. Please sign in again.' });
    } catch (error) {
        console.error('Error in changePassword controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const filter = { role: 'user' };

        const [items, total] = await Promise.all([
            User.find(filter).select('-hashedPassword').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            User.countDocuments(filter),
        ]);

        return res.status(200).json({ items, total, page: Number(page), limit: Number(limit) });
    } catch (error) {
        console.error('Error in getUsers controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const test = async (req, res) => {
    return res.sendStatus(204);
};

export const toggleLikeSong = async (req, res) => {
    try {
        const userId = req.user._id;
        const { songId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Nếu likedSongs bị undefined thì gán nó là mảng rỗng
        if (!user.likedSongs) {
            user.likedSongs = [];
        }
        const isLiked = user.likedSongs.includes(songId);

        if (isLiked) {
            user.likedSongs.pull(songId); // Bỏ thích
        } else {
            user.likedSongs.push(songId); // Thêm vào danh sách thích
        }

        await user.save();
        return res.status(200).json({
            success: true,
            likedSongs: user.likedSongs, // Trả về danh sách mới để FE cập nhật Store
            isLiked: !isLiked
        });
    } catch (error) {
        console.error('Error in toggleLikeSong controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFavoriteSongs = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: 'likedSongs',
            options: { sort: { createdAt: -1 } } // Sắp xếp theo ngày thêm vào
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ favoriteSongs: user.likedSongs });
    } catch (error) {
        console.error('Error in getFavoriteSongs controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};