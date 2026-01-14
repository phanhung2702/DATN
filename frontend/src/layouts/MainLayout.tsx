import SidebarItem from "@/components/layout/SideBarItem";
import PlayerBar from "@/components/player/PlayerBar";
import AvatarMenu from "@/components/layout/AvatarMenu";
import SearchBar from "@/components/layout/SearchBar";
import LyricsView from "@/components/player/LyricsView";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[hsl(var(--foreground))]">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-white border-r border-border/60 px-6 py-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full bg-gradient-primary shadow-glow" />
            <span className="font-bold text-lg">SoundWave</span>
          </div>
          <nav className="flex flex-col gap-2 text-sm font-medium">
            <SidebarItem to="/" icon="home">Trang chủ</SidebarItem>
            <SidebarItem to="/search" icon="search">Tìm kiếm</SidebarItem>
            <SidebarItem to="/library" icon="library_music">Thư viện</SidebarItem>
            <div className="my-4 border-t border-border/60" />
            <SidebarItem to="/playlists" icon="add">Tạo danh sách phát</SidebarItem>
            <SidebarItem to="/liked" icon="favorite">Bài hát đã thích</SidebarItem>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col bg-white">
          <header className="h-16 px-10 flex items-center gap-6">
            <div className="flex-1 max-w-xl"><SearchBar /></div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">🔔</button>
              <AvatarMenu />
            </div>
          </header>
          <main className="flex-1 px-10 pb-36">{children}</main>
        </div>
      </div>
      <PlayerBar />
      <LyricsView />
    </div>
  );
}