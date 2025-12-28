
import PlaylistCard from '../components/PlaylistCard'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Quick pills */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {['Top Hits 2024','Nhạc Lofi','Workout Mix','Acoustic'].map((t) => (
          <div key={t} className="flex items-center gap-3 bg-white/80 dark:bg-input/30 px-6 py-3 rounded-full shadow-soft">
            <div className="h-10 w-10 rounded-full bg-muted/30" />
            <div className="font-medium">{t}</div>
          </div>
        ))}
      </div>

      {/* Recommended grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Dành cho bạn</h2>
          <a className="text-sm text-primary-600">Xem tất cả</a>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <PlaylistCard title="Indie Việt" description="Tuyển tập những bản nhạc Indie Việt" />
          <PlaylistCard title="Nhạc phim hay nhất" description="Những bản nhạc phim bắt hức" />
          <PlaylistCard title="90s Throwbacks" description="Cùng quay về thập niên 90 vui vẻ" />
          <PlaylistCard title="Deep Focus" description="Nhạc không lời giúp bạn tập trung" />
        </div>
      </section>

      {/* Another row */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Playlist nổi bật</h2>
          <a className="text-sm text-primary-600">Xem tất cả</a>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <PlaylistCard title="Chill Hits" description="Những giai điệu chill nhẹ nhàng" />
          <PlaylistCard title="Morning Acoustic" description="Bắt đầu ngày mới thật nhẹ nhàng" />
          <PlaylistCard title="Focus Beats" description="Nhạc tập trung" />
          <PlaylistCard title="Top 50" description="Bảng xếp hạng thịnh hành" />
        </div>
      </section>
    </div>
  )
}
