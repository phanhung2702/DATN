

type Props = {
  title: string
  description?: string
  img?: string
}

export default function PlaylistCard({ title, description, img }: Props) {
  return (
    <div className="w-56">
      <div className="rounded-2xl bg-white/90 dark:bg-input/40 p-4 shadow-soft">
        <div className="h-44 w-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-200 to-pink-100 flex items-center justify-center">
          {img ? (
            <img src={img} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-muted/60 flex items-center justify-center text-sm text-muted-foreground">Album</div>
          )}
        </div>
        <div className="mt-4">
          <div className="font-semibold text-base text-foreground">{title}</div>
          {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
        </div>
      </div>
    </div>
  )
}
