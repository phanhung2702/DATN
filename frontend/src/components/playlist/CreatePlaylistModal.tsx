// src/components/playlist/CreatePlaylistModal.tsx
import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export default function CreatePlaylistModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
        <h2 className="text-xl font-bold mb-6 text-center">Tạo danh sách phát mới</h2>
        
        <input
          autoFocus
          type="text"
          placeholder="Nhập tên danh sách phát"
          className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-primary transition mb-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreate(title)}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-bold text-muted-foreground hover:bg-gray-100 rounded-xl transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onCreate(title)}
            disabled={!title.trim()}
            className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 disabled:opacity-50 transition"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}