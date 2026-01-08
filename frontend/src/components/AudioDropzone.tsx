import React from "react";
import type { AudioMeta } from "../hooks/useUpload";

type Props = {
  audioFile: File | null;
  audioMeta: AudioMeta | null;
  onChange: (f: File | null) => void;
  onRemove: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  error?: string | null;
};

export default function AudioDropzone({
  audioFile,
  audioMeta,
  onChange,
  onRemove,
  containerRef,
  error,
}: Props) {
  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border-2 border-dashed border-surface-dark bg-[#16161d] hover:border-primary hover:bg-[#1a1a24] group cursor-pointer p-6"
    >
      <input
        accept=".mp3,.wav,.flac,.aac"
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-surface-dark/50 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-text-secondary">
            audio_file
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xl font-bold text-white">
            {audioFile
              ? audioFile.name
              : "Kéo thả file nhạc vào đây hoặc nhấn để duyệt"}
          </p>

          <p className="text-text-secondary text-sm">
            {audioFile
              ? `${audioMeta?.format ?? ""} • ${
                  audioMeta?.duration
                    ? `${Math.floor(audioMeta.duration / 60)}:${String(
                        Math.round(audioMeta.duration % 60)
                      ).padStart(2, "0")}`
                    : ""
                } • ${
                  audioMeta?.size
                    ? `${Math.round((audioMeta.size / 1024 / 1024) * 100) / 100} MB`
                    : ""
                }`
              : "MP3, WAV, FLAC (tối đa 200MB)"}
          </p>

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {audioFile && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1 rounded-lg bg-surface-dark hover:bg-red-600 text-sm"
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}
