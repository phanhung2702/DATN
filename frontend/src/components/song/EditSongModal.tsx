import React, { useState } from "react";
import axios from "@/lib/axios";
import {type Song } from "@/stores/usePlayerStore";

export default function EditSongModal({ song, onClose, onRefresh }: { song: Song, onClose: () => void, onRefresh: () => void }) {
  const [formData, setFormData] = useState({
    title: song.title,
    artist: song.artist,
    genre: song.genre || "",
    lyrics: song.lyrics || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/songs/${song._id}`, formData);
      onRefresh();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Lỗi khi cập nhật");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl animate-in zoom-in duration-200">
        <h2 className="text-2xl font-black mb-6">Chỉnh sửa bài hát</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tiêu đề</label>
            <input className="w-full bg-gray-100 border-none rounded-xl p-3 mt-1 focus:ring-2 focus:ring-primary" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Nghệ sĩ</label>
            <input className="w-full bg-gray-100 border-none rounded-xl p-3 mt-1 focus:ring-2 focus:ring-primary" 
              value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Lời bài hát</label>
            <textarea className="w-full bg-gray-100 border-none rounded-xl p-3 mt-1 h-32 resize-none" 
              value={formData.lyrics} onChange={e => setFormData({...formData, lyrics: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2.5 font-bold hover:bg-gray-100 rounded-full transition">Hủy</button>
            <button type="submit" className="px-8 py-2.5 bg-primary text-white font-bold rounded-full hover:scale-105 transition shadow-lg shadow-primary/30">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}