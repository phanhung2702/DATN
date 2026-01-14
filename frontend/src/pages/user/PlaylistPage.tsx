import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/lib/axios";
import CreatePlaylistModal from "@/components/playlist/CreatePlaylistModal";
import DeleteConfirmModal from "@/components/playlist/DeleteConfirmModal";
import { toast } from "sonner"; // Hoặc alert nếu bạn không dùng sonner

interface Playlist {
  _id: string;
  title: string;
  coverUrl: string;
  songs: string[];
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- STATE CHO VIỆC XÓA ---
  const [deleteTarget, setDeleteTarget] = useState<{id: string, title: string} | null>(null);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/playlists/my-playlists");
      setPlaylists(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách phát");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (title: string) => {
  try {
    const res = await axios.post("/playlists", { title });
    const newPlaylist = res.data; // Đây là playlist vừa tạo từ Backend

    // CẬP NHẬT STATE NGAY LẬP TỨC
    setPlaylists((prev) => [newPlaylist, ...prev]); 

    setIsModalOpen(false);
    toast.success("Tạo thành công");
  } catch (error) {
    alert("Lỗi");
  }
};
  // --- HÀM XỬ LÝ XÓA PLAYLIST ---
  const handleOpenDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation(); // Chặn chuyển trang
    setDeleteTarget({ id, title }); // Mở modal xóa
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(`/playlists/${deleteTarget.id}`);
      setPlaylists((prev) => prev.filter((pl) => pl._id !== deleteTarget.id));
      toast.success("Đã xóa danh sách phát");
    } catch (error) {
      toast.error("Lỗi khi xóa playlist");
    } finally {
      setDeleteTarget(null); // Đóng modal
    }
  };

  if (loading) return <div className="p-10 text-muted-foreground font-medium">Đang tải...</div>;

  return (
    <div className="pt-10 px-4">
      <h1 className="text-3xl font-black mb-8">Playlist của bạn</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* NÚT TẠO MỚI */}
        <div onClick={() => setIsModalOpen(true)} className="group cursor-pointer">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <span className="font-bold text-sm text-gray-600 group-hover:text-primary">Tạo danh sách mới</span>
          </div>
        </div>

        {/* DANH SÁCH PLAYLIST */}
        {playlists.map((pl) => (
          <div 
            key={pl._id} 
            onClick={() => navigate(`/playlist/${pl._id}`)}
            className="group cursor-pointer relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-3 shadow-md relative">
              <img 
                src={pl.coverUrl || "/default-playlist.png"} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
              />
              
              {/* Nút Xóa (Chỉ hiện khi hover) */}
              <button
                onClick={(e) => handleOpenDelete(e, pl._id, pl.title)}
                className="absolute top-3 right-3 h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
              </div>
            </div>
            
            <h4 className="font-bold text-sm truncate pr-6">{pl.title}</h4>
            <p className="text-xs text-muted-foreground">{pl.songs.length} bài hát</p>
          </div>
        ))}
      </div>

      <CreatePlaylistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      {/* MODAL XÁC NHẬN XÓA (MỚI THÊM) */}
      <DeleteConfirmModal 
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}