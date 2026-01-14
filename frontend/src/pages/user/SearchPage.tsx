// import { useEffect, useState } from "react";
// import { Search, Loader2, Music } from "lucide-react";
// import api from "../../lib/axios";
// import SongCard from "../../components/SongCard";

// type Song = {
//   _id: string;
//   title: string;
//   artist: string;
//   coverImage?: string;
// };

// export default function SearchPage() {
//   const [query, setQuery] = useState("");
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query.trim()) {
//       setSongs([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/songs/search", {
//           params: { q: query },
//         });
//         setSongs(res.data.data || []);
//       } catch (err) {
//         console.error("Search failed", err);
//       } finally {
//         setLoading(false);
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [query]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
//       <div className="max-w-2xl mx-auto px-4 py-8">
        
//         {/* Title */}
//         <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
//           <Music className="w-6 h-6 text-indigo-600" />
//           Tìm kiếm bài hát
//         </h1>

//         {/* Search Input */}
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Nhập tên bài hát, ca sĩ..."
//             className="
//               w-full
//               pl-12 pr-4 py-3
//               rounded-xl
//               border border-gray-200
//               focus:border-indigo-500
//               focus:ring-2 focus:ring-indigo-100
//               outline-none
//               transition
//             "
//           />
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="flex justify-center mt-6">
//             <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
//           </div>
//         )}

//         {/* Result */}
//         <div className="mt-6 space-y-3">
//           {songs.map((song) => (
//             <SongCard key={song._id} song={song} />
//           ))}
//         </div>

//         {/* Empty state */}
//         {!loading && query && songs.length === 0 && (
//           <div className="text-center mt-10 text-gray-500">
//             <Music className="w-10 h-10 mx-auto mb-2 opacity-50" />
//             <p>Không tìm thấy bài hát phù hợp</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Music } from "lucide-react";
import api from "../../lib/axios";
import SongCard from "../../components/song/SongCard";

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
};


export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get("/songs/search", {
          params: { q: query },
        });
        setSongs(res.data.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  /* ================= UI ================= */

  if (!query) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nhập từ khóa để tìm bài hát hoặc nghệ sĩ</p>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-xl font-semibold mb-6">
        Kết quả tìm kiếm cho “{query}”
      </h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Result */}
      <div className="grid grid-cols-1 gap-3">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>

      {/* Empty */}
      {!loading && songs.length === 0 && (
        <div className="text-center mt-16 text-muted-foreground">
          <Music className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Không tìm thấy bài hát phù hợp</p>
        </div>
      )}
    </div>
  );
}
