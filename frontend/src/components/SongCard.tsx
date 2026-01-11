type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
};

export default function SongCard({ song }: { song: Song }) {
  return (
    <div className="flex gap-3 p-3 rounded border hover:bg-gray-100">
      <img
        src={song.coverImage || "/placeholder.jpg"}
        className="w-14 h-14 object-cover rounded"
      />
      <div>
        <h3 className="font-medium">{song.title}</h3>
        <p className="text-sm text-gray-500">{song.artist}</p>
      </div>
    </div>
  );
}
