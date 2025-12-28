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