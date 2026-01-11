import React from "react";
import { NavLink } from "react-router-dom";
import AvatarMenu from "../components/AvatarMenu";

import SearchBar from "@/components/SearchBar";




export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[hsl(var(--foreground))]">
      <div className="flex min-h-screen">
        {/* ================= Sidebar ================= */}
        <aside className="w-64 bg-white border-r border-border/60 px-6 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full bg-gradient-primary shadow-glow" />
            <span className="font-bold text-lg">SoundWave</span>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2 text-sm font-medium">
            <SidebarItem to="/" icon="home">
              Trang chủ
            </SidebarItem>
            <SidebarItem to="/search" icon="search">
              Tìm kiếm
            </SidebarItem>
            <SidebarItem to="/library" icon="library_music">
              Thư viện
            </SidebarItem>

            <div className="my-4 border-t border-border/60" />

            <SidebarItem to="/playlist/create" icon="add">
              Tạo danh sách phát
            </SidebarItem>
            <SidebarItem to="/liked" icon="favorite">
              Bài hát đã thích
            </SidebarItem>
          </nav>
        </aside>

        {/* ================= Main ================= */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Topbar */}
          <header className="h-16 px-10 flex items-center gap-6">
  {/* Search */}
  <div className="flex-1 max-w-xl">
    <SearchBar />
  </div>

  {/* Actions */}
  <div className="flex items-center gap-4 ml-auto">
    <button className="h-10 w-10 rounded-full bg-white/80 dark:bg-input/30 flex items-center justify-center">
      🔔
    </button>
    <AvatarMenu />
  </div>
</header>
          {/* Content */}
          <main className="flex-1 px-10 pb-36">
            {children}
          </main>
        </div>
      </div>

      {/* ================= Player ================= */}
      <PlayerBar />
    </div>
  );
}

/* ================= Sidebar Item ================= */

function SidebarItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent/10"
        }`
      }
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      {children}
    </NavLink>
  );
}

/* ================= Player Bar ================= */

function PlayerBar() {
  return (
    <div className="fixed left-0 right-0 bottom-0 bg-white/80 backdrop-blur border-t border-border/60">
      <div className="max-w-7xl mx-auto px-10 py-4 flex items-center gap-6">
        {/* Song */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="h-12 w-12 rounded-md bg-muted/40" />
          <div>
            <div className="font-semibold">Blinding Lights</div>
            <div className="text-sm text-muted-foreground">
              The Weeknd
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <IconBtn icon="shuffle" />
            <IconBtn icon="skip_previous" />
            <button className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">
                play_arrow
              </span>
            </button>
            <IconBtn icon="skip_next" />
            <IconBtn icon="repeat" />
          </div>

          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-muted-foreground">1:21</span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/3" />
            </div>
            <span className="text-xs text-muted-foreground">3:20</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-1/4 flex justify-end items-center gap-3">
          <span className="material-symbols-outlined">volume_up</span>
          <div className="h-1 w-24 bg-border rounded-full">
            <div className="h-1 w-2/3 bg-primary rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon }: { icon: string }) {
  return (
    <button className="text-muted-foreground hover:text-foreground transition">
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
