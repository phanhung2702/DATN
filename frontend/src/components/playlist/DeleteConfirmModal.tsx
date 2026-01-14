// src/components/playlist/DeleteConfirmModal.tsx
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Nền mờ */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Nội dung Modal */}
      <div className="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-300 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-red-500 text-4xl font-bold">delete_forever</span>
        </div>
        
        <h2 className="text-2xl font-black mb-3">Xóa playlist?</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Danh sách phát <span className="font-bold text-foreground">"{title}"</span> sẽ bị xóa vĩnh viễn. Bạn không thể hoàn tác hành động này.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 active:scale-95 transition shadow-lg shadow-red-200"
          >
            Xóa vĩnh viễn
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 font-bold text-muted-foreground hover:bg-gray-100 rounded-2xl transition"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}