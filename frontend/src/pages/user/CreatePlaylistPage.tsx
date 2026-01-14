// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "@/lib/axios";
// import { usePlayerStore, type Song } from "@/stores/usePlayerStore";
// import LikeButton from "@/components/song/LikeButton";
// import SongMoreMenuUser from "@/components/user/SongMoreMenuUser";

// interface PlaylistDetail {
//   _id: string;
//   title: string;
//   description: string;
//   coverUrl: string;
//   creator: {
//     username: string;
//     displayName: string;
//   };
//   songs: Song[];
// }

// export default function CreatePlaylistPage() {
//   const { id } = useParams(); // Lấy ID playlist từ URL
//   const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { setQueue, currentSong, isPlaying } = usePlayerStore();

//   useEffect(() => {
//   const fetchPlaylist = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/playlists/${id}`);
//       console.log("Dữ liệu playlist:", res.data); // Thêm log để kiểm tra
//       setPlaylist(res.data);
//     } catch (error: any) {
//       console.error("Lỗi API:", error.response || error);
//       // Nếu lỗi thì cũng phải tắt loading
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) {
//     fetchPlaylist();
//   } else {
//     setLoading(false); // Nếu không có ID, tắt loading ngay
//   }
// }, [id]);

//   const formatDuration = (d?: number) => {
//     if (!d) return "0:00";
//     const m = Math.floor(d / 60);
//     const s = Math.round(d % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   if (loading) return <div className="p-10 text-muted-foreground animate-pulse font-medium">Đang nạp danh sách phát...</div>;
//   if (!playlist) return <div className="p-10 text-center">Chưa có danh sách phát nào.</div>;

//   return (
//     <div className="max-w-6xl mx-auto pb-20">
//       {/* ================= HEADER SECTION ================= */}
//       <div className="flex flex-col md:flex-row items-end gap-8 mb-10 pt-10 px-4">
//         {/* Cover Image */}
//         <div className="w-60 h-60 flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden group relative">
//           <img 
//             src={playlist.coverUrl || "/default-playlist.png"} 
//             className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
//           />
//           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//              <span className="material-symbols-outlined text-white text-6xl">play_circle</span>
//           </div>
//         </div>

//         {/* Info */}
//         <div className="flex-1">
//           <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 block">
//             Playlist Công Khai
//           </span>
//           <h1 className="text-7xl font-black mb-6 tracking-tighter">{playlist.title}</h1>
          
//           <div className="flex items-center gap-2 text-sm font-medium">
//             <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
//                {playlist.creator.displayName.charAt(0)}
//             </div>
//             <span className="hover:underline cursor-pointer">{playlist.creator.displayName}</span>
//             <span className="text-muted-foreground">•</span>
//             <span>{playlist.songs.length} bài hát</span>
//           </div>
//         </div>
//       </div>

//       {/* ================= ACTIONS BAR ================= */}
//       <div className="px-4 mb-8 flex items-center gap-6">
//         <button 
//           onClick={() => playlist.songs.length > 0 && setQueue(playlist.songs, 0)}
//           className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition shadow-lg shadow-primary/30"
//         >
//           <span className="material-symbols-outlined text-4xl">play_arrow</span>
//         </button>
//         <button className="text-muted-foreground hover:text-foreground transition">
//           <span className="material-symbols-outlined text-3xl">favorite</span>
//         </button>
//         <button className="text-muted-foreground hover:text-foreground transition">
//           <span className="material-symbols-outlined text-3xl">more_horiz</span>
//         </button>
//       </div>

//       {/* ================= SONG LIST ================= */}
//       <div className="flex flex-col">
//         {/* Table Header */}
//         <div className="grid grid-cols-[40px_1fr_1fr_80px_100px] gap-4 px-4 py-2 text-xs font-bold text-muted-foreground border-b border-border/40 mb-2 uppercase tracking-widest">
//           <div className="text-center">#</div>
//           <div>Tiêu đề</div>
//           <div className="hidden md:block">Album/Thể loại</div>
//           <div className="text-right"><span className="material-symbols-outlined text-lg">schedule</span></div>
//           <div></div>
//         </div>

//         {/* List Body */}
//         {playlist.songs.length === 0 ? (
//           <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl mt-4">
//              <span className="material-symbols-outlined text-5xl mb-2 opacity-20">library_music</span>
//              <p className="font-bold">Danh sách phát này hiện chưa có bài hát nào.</p>
//           </div>
//         ) : (
//           playlist.songs.map((song, index) => {
//             const isPlayingThis = currentSong?._id === song._id && isPlaying;
//             return (
//               <div
//                 key={song._id}
//                 onClick={() => setQueue(playlist.songs, index)}
//                 className={`grid grid-cols-[40px_1fr_1fr_80px_100px] gap-4 px-4 py-3 rounded-xl transition-all items-center group cursor-pointer
//                   ${currentSong?._id === song._id ? "bg-primary/5 shadow-sm" : "hover:bg-gray-100/60"}`}
//               >
//                 {/* Index */}
//                 <div className="text-center">
//                   <span className={`font-bold ${isPlayingThis ? "text-primary" : "text-muted-foreground"}`}>
//                     {index + 1}
//                   </span>
//                 </div>

//                 {/* Title & Info */}
//                 <div className="flex items-center gap-4 min-w-0">
//                   <img src={song.coverUrl} className="w-11 h-11 rounded-lg object-cover shadow-sm" />
//                   <div className="min-w-0">
//                     <div className={`font-bold truncate ${isPlayingThis ? "text-primary" : ""}`}>{song.title}</div>
//                     <div className="text-xs text-muted-foreground truncate font-medium">{song.artist}</div>
//                   </div>
//                 </div>

//                 {/* Album/Genre */}
//                 <div className="hidden md:block text-sm text-muted-foreground truncate font-medium italic">
//                   {song.genre || "N/A"}
//                 </div>

//                 {/* Duration */}
//                 <div className="text-right text-sm text-muted-foreground font-mono">
//                   {formatDuration(song.duration)}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-end gap-3 pr-2">
//                    <LikeButton songId={song._id} />
//                    <SongMoreMenuUser song={song} />
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }