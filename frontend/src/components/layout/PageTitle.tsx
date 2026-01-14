export default function PageTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h1 className="
      text-2xl
      font-semibold
      tracking-tight
      text-foreground
      mb-6
    ">
      {children}
    </h1>
  );
}
