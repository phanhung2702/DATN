import SongCard from "./SongCard";


type Song = {
  _id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number;
  createdAt?: string;
};


export default function SongGrid({
  songs,
  loading,
}: {
  songs: Song[];
  loading?: boolean;
}) {
  if (loading) {
    return <p className="text-muted-foreground">Đang tải...</p>;
  }

  if (!songs.length) {
    return <p className="text-muted-foreground">Không có bài hát nào</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {songs.map((song) => (
        <SongCard key={song._id} song={song} />
      ))}
    </div>
  );
}
