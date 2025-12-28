import React from 'react'
import { Link } from 'react-router-dom'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 min-h-screen bg-[hsl(var(--sidebar-background))] p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-full bg-gradient-primary shadow-glow" />
            <div>
              <div className="font-bold">SoundWave</div>
              <div className="text-xs text-muted-foreground">Nghe nhạc không giới hạn</div>
            </div>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <Link to="/" className="px-3 py-2 rounded-lg bg-primary/5 text-primary-600">Trang chủ</Link>
            <a className="px-3 py-2 rounded-lg hover:bg-accent/5">Tìm kiếm</a>
            <a className="px-3 py-2 rounded-lg hover:bg-accent/5">Thư viện</a>
            <a className="px-3 py-2 rounded-lg hover:bg-accent/5">Tạo danh sách phát</a>
            <a className="px-3 py-2 rounded-lg hover:bg-accent/5">Bài hát đã thích</a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold">Trang chủ</h1>
              <div className="text-lg text-muted-foreground">Chào buổi sáng</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="h-10 w-10 rounded-full bg-white/80 dark:bg-input/30 flex items-center justify-center">🔔</button>
              <div className="h-10 w-10 rounded-full bg-gradient-primary" />
            </div>
          </header>

          <div>{children}</div>
        </main>
      </div>

      {/* Player bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/80 dark:bg-input/40 border-t border-border/60 backdrop-blur py-4">
        <div className="max-w-6xl mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md bg-muted/30" />
            <div>
              <div className="font-semibold">Blinding Lights</div>
              <div className="text-sm text-muted-foreground">The Weeknd</div>
            </div>
          </div>

          <div className="flex-1 px-8">
            <div className="flex items-center justify-center gap-6">
              <button className="h-12 w-12 rounded-full bg-primary text-white">◀◀</button>
              <button className="h-14 w-14 rounded-full bg-primary text-white">▶</button>
              <button className="h-12 w-12 rounded-full bg-primary/20">▶▶</button>
            </div>
            <div className="h-1 bg-border mt-3 rounded-full">
              <div className="h-1 bg-primary rounded-full w-1/3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">1:21</div>
            <div className="h-1 w-24 bg-border rounded-full" />
            <button className="h-8 w-8 rounded-full bg-accent/30" />
          </div>
        </div>
      </div>
    </div>
  )
}
