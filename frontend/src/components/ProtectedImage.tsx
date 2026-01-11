import React, { useEffect, useState } from "react";
import { fetchProtectedImage } from "../utils/fetchProtectedImage";

export default function ProtectedImage({
  src,
  alt,
  className,
  placeholder,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  placeholder?: string;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;
  let created: string | null = null;

  if (!src) return;

  (async () => {
    try {
      created = await fetchProtectedImage(src);
      if (!cancelled) setBlobUrl(created);
    } catch {
      if (!cancelled) setBlobUrl(null);
    }
  })();

  return () => {
    cancelled = true;
    if (created) URL.revokeObjectURL(created);
  };
}, [src]);

  const display = blobUrl ?? placeholder ?? "/placeholder-cover.jpg";
  return <img src={display} alt={alt ?? ""} className={className} />;
}