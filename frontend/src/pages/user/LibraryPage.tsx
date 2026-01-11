import { useEffect, useState } from "react";
import api from "@/lib/axios";
import SongGrid from "@/components/SongGrid";
import EmptyState from "@/components/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PageTitle from "@/components/PageTitle";

type Song = {
  _id: string;
  title: string;
  artist: string;
  coverImage?: string;
};

export default function LibraryPage() {
  const [mySongs, setMySongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([
      api.get("/me/library"),
      api.get("/me/liked"),
    ])
      .then(([libRes, likedRes]) => {
        setMySongs(libRes.data);
        setLikedSongs(likedRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6 py-6">
      <PageTitle>🎧 Thư viện của bạn</PageTitle>

      <Tabs defaultValue="library">
        <TabsList className="mb-6">
          <TabsTrigger value="library">Bài hát</TabsTrigger>
          <TabsTrigger value="liked">Đã thích</TabsTrigger>
          <TabsTrigger value="playlist">Playlist</TabsTrigger>
        </TabsList>

        {/* Bài hát của tôi */}
        <TabsContent value="library">
          <SongGrid songs={mySongs} loading={loading} />
        </TabsContent>

        {/* Đã thích */}
        <TabsContent value="liked">
          <SongGrid songs={likedSongs} loading={loading} />
        </TabsContent>

        {/* Playlist (placeholder) */}
        <TabsContent value="playlist">
          <EmptyState label="Bạn chưa có playlist nào 🎶" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
