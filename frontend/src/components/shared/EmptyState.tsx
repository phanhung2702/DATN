export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <span className="text-lg">{label}</span>
    </div>
  );
}
