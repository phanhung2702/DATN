import React from "react";
import SidebarItem from "../components/layout/SideBarItem";
import PlayerBar from "../components/player/PlayerBar";
import AvatarMenu from "../components/layout/AvatarMenu";
import LyricsView from "@/components/player/LyricsView";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-border/60 bg-white px-6 py-6 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full bg-primary shadow-glow" />
            <div className="font-bold text-lg">SoundWave Admin</div>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <SidebarItem to="/admin" icon="dashboard">Tổng quan</SidebarItem>
            <SidebarItem to="/admin/library" icon="library_music">Thư viện</SidebarItem>
            <SidebarItem to="/admin/users" icon="group">Người dùng</SidebarItem>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/60 px-8 flex items-center justify-between">
            <div className="font-bold text-xl text-primary">Admin Dashboard</div>
            <div className="flex items-center gap-4"><AvatarMenu /></div>
          </header>
          <main className="flex-1 px-10 py-8 pb-32">{children}</main>
        </div>
      </div>
      {/* Giờ đây trang Admin cũng có thể nghe nhạc! */}
      <PlayerBar />
      <LyricsView />
    </div>
  );
}

