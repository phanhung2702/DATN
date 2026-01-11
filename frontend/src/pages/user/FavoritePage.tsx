import { useEffect, useState } from "react";
import { Heart, Loader2, Music } from "lucide-react";
import api from "@/lib/axios";
import SongCard from "@/components/SongCard";
import PageTitle from "@/components/PageTitle";

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
};

export default function FavoritePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api
      .get("/me/liked")
      .then((res) => setSongs(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-10 py-8">
      {/* ===== Title ===== */}
      <PageTitle>
        <span className="inline-flex items-center gap-2">
          <Heart className="text-primary" />
          Bài hát đã thích
        </span>
      </PageTitle>

      {/* ===== Loading ===== */}
      {loading && (
        <div className="flex justify-center mt-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* ===== Empty ===== */}
      {!loading && songs.length === 0 && (
        <div className="text-center mt-20 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Bạn chưa thích bài hát nào</p>
        </div>
      )}

      {/* ===== Songs ===== */}
      <div className="grid grid-cols-1 gap-3">
        {songs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}
