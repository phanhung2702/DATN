import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { usePlayerStore, type Song } from "@/stores/usePlayerStore";
import LikeButton from "@/components/song/LikeButton";
import SongMoreMenuUser from "@/components/user/SongMoreMenuUser";

export default function Home() {
  const [newSongs, setNewSongs] = useState<Song[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue } = usePlayerStore();

   // Hàm format giây thành mm:ss
  const formatDuration = (d?: number) => {
    if (!d && d !== 0) return "--:--";
    const m = Math.floor(d / 60);
    const s = Math.round(d % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Gọi đồng thời các API (Bạn cần bổ sung các hàm này ở Backend)
        const [resNew, resTop] = await Promise.all([
          axios.get("/songs", { params: { limit: 12 } }), // Bài mới
          axios.get("/songs/top") // Top 10 bảng xếp hạng
        ]);
        console.log("DỮ liệu bài hát", resNew.data);

        // Kiểm tra backend trả về res.data.items hay res.data trực tiếp
        const songs = resNew.data.items || resNew.data;

        setNewSongs(Array.isArray(songs) ? songs : []);
        setTopSongs(Array.isArray(resTop.data) ? resTop.data : []);
      } catch (error) {
        console.error("Lỗi tải trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <div className="p-10 text-muted-foreground">Đang tải trải nghiệm âm nhạc...</div>;

  return (
    <div className="space-y-10 pb-20">
      {/* 1. BANNER SECTION (Hero) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newSongs.slice(0, 3).map((song, i) => (
          <div key={i} className="relative group overflow-hidden rounded-2xl aspect-[16/9] cursor-pointer">
            <img 
              src={song.coverUrl} 
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
               <span className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Nổi bật</span>
               <h2 className="text-white text-2xl font-black">{song.title}</h2>
               <p className="text-white/60 text-sm">{song.artist}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 2. MỚI PHÁT HÀNH */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight">Mới Phát Hành</h2>
          <button className="text-xs font-bold text-muted-foreground hover:text-primary uppercase">Tất cả</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {newSongs.map((song, index) => (
            <div 
              key={song._id} 
              onClick={() => setQueue(newSongs, index)}
              className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer group"
            >
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                <img src={song.coverUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                   <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate text-sm">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              {/* KHU VỰC THAY ĐỔI: DURATION VÀ ACTIONS */}
  <div className="flex items-center gap-2">
    {/* Chỉ hiện thời lượng khi KHÔNG hover */}
    <div className="text-xs text-muted-foreground font-medium pr-2 group-hover:hidden">
      {formatDuration(song.duration)}
    </div>

    {/* Hiện các nút chức năng khi hover vào hàng */}
    <div className="hidden group-hover:flex items-center gap-1">
      <LikeButton songId={song._id} />
      <SongMoreMenuUser song={song} />
    </div>
  </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BẢNG XẾP HẠNG (CHART) */}
      <section className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">#SoundWaveChart</h2>
          <span className="material-symbols-outlined text-4xl">play_circle</span>
        </div>
        
        <div className="space-y-4">
          {topSongs.slice(0, 3).map((song, index) => (
            <div 
              key={song._id}
              onClick={() => setQueue(topSongs, index)}
              className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition group cursor-pointer border border-white/5"
            >
              <span className={`text-4xl font-black w-10 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {index + 1}
              </span>
              <img src={song.coverUrl} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{song.title}</h4>
                <p className="text-sm text-white/60 truncate">{song.artist}</p>
              </div>
              <div className="text-lg font-bold opacity-0 group-hover:opacity-100 transition">
                 <span className="material-symbols-outlined">play_arrow</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="px-8 py-2 rounded-full border border-white/20 hover:bg-white/10 transition text-sm font-bold">Xem thêm</button>
        </div>
      </section>

      {/* 4. GỢI Ý THEO CHỦ ĐỀ */}
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-6">Tâm trạng hôm nay</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
           {/* Giả sử bạn có các Playlist tĩnh */}
           <PlaylistStaticCard title="Giai điệu lãng mạn" img="/assets/topic1.jpg" />
           <PlaylistStaticCard title="Năng lượng EDM" img="/assets/topic2.jpg" />
           <PlaylistStaticCard title="Chill cuối tuần" img="/assets/topic3.jpg" />
           <PlaylistStaticCard title="Cà phê sáng" img="/assets/topic4.jpg" />
           <PlaylistStaticCard title="Tập trung làm việc" img="/assets/topic5.jpg" />
        </div>
      </section>
    </div>
  );
}

function PlaylistStaticCard({ title, img }: { title: string, img: string }) {
  return (
    <div className="cursor-pointer group">
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 shadow-lg">
        <img src={img} className="w-full h-full object-cover transition group-hover:scale-110 duration-500" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
        </div>
      </div>
      <h4 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-primary transition">{title}</h4>
    </div>
  );
}