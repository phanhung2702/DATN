import { usePlayerStore } from "@/stores/usePlayerStore";

export default function LyricsView() {
  const { currentSong, showLyrics, toggleLyrics } = usePlayerStore();

  if (!showLyrics || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl text-white overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto px-10 py-20 relative">
        {/* Nút đóng */}
        <button 
          onClick={toggleLyrics}
          className="fixed top-10 right-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Ảnh và thông tin bài hát (bên trái) */}
          <div className="w-full md:w-1/3 sticky top-20">
            <img 
              src={currentSong.coverUrl} 
              className="w-full aspect-square object-cover rounded-2xl shadow-2xl mb-6" 
            />
            <h1 className="text-3xl font-bold mb-2">{currentSong.title}</h1>
            <p className="text-xl text-white/60">{currentSong.artist}</p>
          </div>

          {/* Lời bài hát (bên phải) */}
          <div className="w-full md:w-2/3">
            <h2 className="text-sm uppercase tracking-widest text-white/40 mb-8 font-bold">Lyrics</h2>
            <div className="text-2xl md:text-4xl font-bold leading-relaxed md:leading-loose text-white/80">
              {currentSong.lyrics ? (
                <div className="whitespace-pre-line">
                  {currentSong.lyrics}
                </div>
              ) : (
                <p className="italic text-white/20">Dữ liệu lời bài hát đang được cập nhật...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}