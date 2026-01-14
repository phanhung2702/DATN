import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import axios from "@/lib/axios"; // Đảm bảo bạn đã import axios từ cấu hình của mình

export default function PlayerBar() {
  const { 
    currentSong, isPlaying, togglePlay, volume, setVolume, setIsPlaying,
    playNext, playPrevious, isShuffled, toggleShuffle, repeatMode, toggleRepeat, showLyrics, toggleLyrics
  } = usePlayerStore();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Ref để theo dõi xem bài hát hiện tại đã được tính lượt nghe chưa
  const hasCountedRef = useRef<string | null>(null);

  // 1. Xử lý khi thay đổi bài hát (Chỉ chạy khi ID bài hát thay đổi)
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const songUrl = currentSong.audioUrl || (currentSong as any).url;
    const encodedUrl = encodeURI(songUrl);

    if (audioRef.current.src !== encodedUrl) {
      audioRef.current.src = encodedUrl;
      audioRef.current.load(); // Nạp bài mới
      
      // Reset cờ tính lượt nghe khi sang bài mới
      hasCountedRef.current = null;

      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentSong?._id]); // Chỉ theo dõi ID bài hát để tránh nạp lại vô ích

  // 2. Xử lý Play/Pause
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Lỗi phát nhạc:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // 3. Xử lý âm lượng
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 4. Xử lý khi ĐĂNG XUẤT hoặc xóa bài hát hiện tại
  useEffect(() => {
    if (!currentSong && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentTime(0);
      setProgress(0);
      hasCountedRef.current = null;
    }
  }, [currentSong]);

  const handleEnded = () => {
    if (repeatMode === "one") {
      audioRef.current!.currentTime = 0;
      audioRef.current!.play();
    } else {
      playNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (val / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(val);
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      
      setCurrentTime(current);
      if (total) {
        setProgress((current / total) * 100);
      }

      // --- LOGIC TĂNG LƯỢT NGHE TỰ ĐỘNG ---
      // Nếu nghe quá 15 giây và bài hát này chưa được tính lượt nghe
      if (current > 15 && currentSong && hasCountedRef.current !== currentSong._id) {
        hasCountedRef.current = currentSong._id; // Đánh dấu đã tính ngay lập tức để tránh gọi API nhiều lần
        
        axios.post(`/songs/${currentSong._id}/play`).catch((err) => {
          console.error("Lỗi khi tăng lượt nghe:", err);
          hasCountedRef.current = null; // Nếu lỗi API thì cho phép thử lại
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md border-t p-3 z-50 shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
      />

      <div className="max-w-7xl mx-auto flex items-center gap-8">
        {/* Info bài hát */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <img src={currentSong.coverUrl} className="h-12 w-12 rounded-lg object-cover shadow-sm" alt={currentSong.title} />
          <div className="min-w-0">
            <div className="font-bold truncate text-sm">{currentSong.title}</div>
            <div className="text-xs text-muted-foreground truncate">{currentSong.artist}</div>
          </div>
        </div>

        {/* Cụm điều khiển chính */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-6">
            <IconBtn icon="shuffle" active={isShuffled} onClick={toggleShuffle} />
            <IconBtn icon="skip_previous" onClick={playPrevious} />
            
            <button 
              onClick={togglePlay}
              className="h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-3xl">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>

            <IconBtn icon="skip_next" onClick={playNext} />
            <IconBtn 
              icon={repeatMode === "one" ? "repeat_one" : "repeat"} 
              active={repeatMode !== "off"} 
              onClick={toggleRepeat} 
            />
          </div>

          {/* Thanh tua nhạc */}
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-[10px] font-medium text-muted-foreground w-10 text-right">
              {formatTime(currentTime)} 
            </span>
            <input 
              type="range"
              min="0" max="100" step="0.1"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1.5 accent-primary bg-gray-200 rounded-full appearance-none cursor-pointer hover:h-2 transition-all"
              style={{
                background: `linear-gradient(to right, #7c3aed ${progress}%, #e5e7eb ${progress}%)`
              }}
            />
            <span className="text-[10px] font-medium text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Cụm Volume & Lời bài hát */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          <button 
            onClick={toggleLyrics}
            className={`transition-colors flex items-center ${showLyrics ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title="Lời bài hát"
          >
            <span className="material-symbols-outlined text-2xl">lyrics</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-foreground text-xl">
              {volume === 0 ? "volume_off" : "volume_up"}
            </span>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (audioRef.current) audioRef.current.volume = val;
              }}
              className="w-24 h-1 accent-primary cursor-pointer appearance-none bg-gray-200 rounded-full"
              style={{
                background: `linear-gradient(to right, #7c3aed ${volume * 100}%, #e5e7eb ${volume * 100}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon, onClick, active }: { icon: string; onClick?: () => void; active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`transition-colors flex items-center justify-center ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
    >
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </button>
  );
}