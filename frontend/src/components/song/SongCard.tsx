import { type Song, usePlayerStore } from "@/stores/usePlayerStore";


export default function SongCard({ song }: { song: Song }) {
  const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePlay = () => {
    // Kiểm tra xem bài hát có trường 'audioUrl' không
    if (!song.audioUrl) {
      console.error("Dữ liệu bài hát thiếu trường 'audioUrl':", song);
    }
    setCurrentSong(song);
  };
  
  // Kiểm tra xem bài này có đang được phát không
  const isSelected = currentSong?._id === song._id;

  return (
    <div 
      onClick={() => setCurrentSong(song)}
      className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer group
        ${isSelected ? "bg-primary/5 border-primary/20" : "hover:bg-gray-50 border-transparent"}`}
    >
      <div className="relative h-14 w-14 flex-shrink-0">
        <img
          src={song.coverUrl || "/placeholder.jpg"}
          className="w-full h-full object-cover rounded-lg shadow-sm"
        />
        {/* Hiện icon play khi hover hoặc khi đang chọn */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg transition
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <span className="material-symbols-outlined text-white text-2xl">
            {isSelected && isPlaying ? "pause" : "play_arrow"}
          </span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
          {song.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  );
}