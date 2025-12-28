import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true 
    },
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,  
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String, // Link CDN để hiển thị hình ảnh
    },
    avatarId: {
        type: String, // Cloudinary public_id để xóa hình cũ
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, 
    { 
    timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
export default User;