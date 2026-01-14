import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: String,
        required: true,
        trim: true,
    },
    album: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number, // seconds
    },
    audioUrl: {
        type: String,
        required: true,
    },
    coverUrl: {
        type: String,
    },
    genre: {
        type: String,
        trim: true,
    },
    lyrics: {
        type: String,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);
export default Song;
