import React, { useEffect, useState, type JSX } from "react";
import axios from "../../lib/axios";
import ProtectedImage from "../../components/ProtectedImage";

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  duration?: number;
  createdAt?: string;
};

export default function AdminLibrary(): JSX.Element {
  const [items, setItems] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 24;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/songs/admin", { params: { page, limit } }); // protected route
        if (!mounted) return;
        setItems(res.data.items ?? []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e?.response?.data?.message ?? e?.message ?? "Lỗi khi tải danh sách");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [page]);

  const formatDuration = (d?: number) => {
    if (!d && d !== 0) return "";
    const m = Math.floor(d! / 60);
    const s = Math.round(d! % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thư viện</h1>
        <div className="text-sm text-muted-foreground">Tổng: {items.length}</div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Đang tải...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(song => (
            <div key={song._id} className="bg-input rounded-lg p-3 flex flex-col gap-2">
            <div className="w-full aspect-square bg-gray-800 rounded overflow-hidden">
              <ProtectedImage
                src={song.coverUrl ?? null}
                alt={song.title}
                className="w-full h-full object-cover"
                placeholder="/placeholder-cover.png"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm truncate">{song.title}</div>
              <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
            </div>
            <div className="text-xs text-muted-foreground">{formatDuration(song.duration)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-input">Trước</button>
        <div className="text-sm">Trang {page}</div>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-input">Tiếp</button>
      </div>
    </div>
  );
}