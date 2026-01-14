// src/components/LikeButton.tsx
import axios from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";


interface LikeButtonProps {
  songId: string;
  onToggle?: (isLiked: boolean) => void; // Thêm dòng này
}

export default function LikeButton({ songId, onToggle }: LikeButtonProps) {
  const { likedSongs, setLikedSongs, user } = useAuthStore();
  const isLiked = (likedSongs || []).includes(songId);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert("Vui lòng đăng nhập");

    try {
      const res = await axios.post(`/user/like/${songId}`);
      if (res.data.success) {
        setLikedSongs(res.data.likedSongs);
        
        // GỌI CALLBACK NẾU CÓ
        if (onToggle) {
          onToggle(res.data.isLiked); 
        }
      }
    } catch (err) {
      console.error("Lỗi like:", err);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      className="flex items-center justify-center hover:scale-110 transition p-1 group"
    >
      <span 
        className={`material-symbols-outlined text-xl transition-all duration-200
          ${isLiked ? "text-primary fill-1 scale-110" : "text-muted-foreground group-hover:text-foreground"}`}
      >
        favorite
      </span>
    </button>
  );
}