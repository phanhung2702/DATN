import React from "react";
import { NavLink} from "react-router-dom";
import AvatarMenu from "../components/AvatarMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex min-h-screen">
        {/* ================= Sidebar ================= */}
        <aside className="w-64 border-r border-border/60 bg-[hsl(var(--sidebar-background))] px-6 py-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-full bg-gradient-primary shadow-glow" />
            <div className="font-bold text-lg">SoundWave</div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2 text-sm">
            <SidebarItem to="/admin" icon="dashboard">
              Tổng quan
            </SidebarItem>
            <SidebarItem to="/admin/library" icon="library_music">
              Thư viện
            </SidebarItem>
            <SidebarItem to="/admin/users" icon="group">
              Người dùng
            </SidebarItem>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />
        </aside>

        {/* ================= Main ================= */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 border-b border-border/60 px-8 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-[420px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <input
                placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                className="w-full rounded-lg bg-input px-10 py-2 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="h-10 w-10 rounded-full bg-white/80 dark:bg-input/30 flex items-center justify-center">🔔</button>
              <AvatarMenu />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-10 py-8">{children}</main>
        </div>
      </div>
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
      end={true}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium
        ${
          isActive
            ? "bg-primary text-white"
            : "text-muted-foreground hover:bg-accent/10"
        }`
      }
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      {children}
    </NavLink>
  );
}
