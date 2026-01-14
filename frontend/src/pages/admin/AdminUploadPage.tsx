import React, { type JSX } from "react";
import useUpload from "../../hooks/useUpload";
import CoverUploader from "../../components/upload/CoverUploader";
import AudioDropzone from "../../components/upload/AudioDropzone";

export default function AdminUploadPage(): JSX.Element {
  const {
    title, setTitle,
    artist, setArtist,
    album, setAlbum,
    genre, setGenre,
    description, setDescription,
    coverPreview,
    audioFile, audioMeta,
    progress, status, error,
    audioDropRef,
    upload,
    handleCoverChange, handleAudioChange
  } = useUpload();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold">Tải nhạc mới</h1>
          <p className="text-muted-foreground mt-1">
            Điền thông tin chi tiết và tải lên file nhạc
          </p>
        </div>

        {/* <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-accent/10"
          >
            Hủy bỏ
          </button>
          <button
            onClick={saveDraft}
            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Lưu nháp
          </button>
        </div> */}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Ảnh bìa Album</h3>
            <CoverUploader
              preview={coverPreview}
              onChange={handleCoverChange}
            />
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-yellow-400">
                lightbulb
              </span>
              <div>
                <p className="font-semibold text-sm">Mẹo tối ưu</p>
                <p className="text-xs text-muted-foreground">
                  Ảnh vuông 3000×3000 px, ≤5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Info */}
          <section>
            <h3 className="text-lg font-semibold border-b border-border pb-2">
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Tên bài hát <span className="text-red-500">*</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-input px-4 py-3 focus:ring-2 focus:ring-primary"
                  placeholder="Tên bài hát"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Nghệ sĩ chính <span className="text-red-500">*</span>
                </label>
                <input
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  className="w-full rounded-lg bg-input px-4 py-3 focus:ring-2 focus:ring-primary"
                  placeholder="Nghệ sĩ"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Album
                </label>
                <input
                  value={album}
                  onChange={e => setAlbum(e.target.value)}
                  className="w-full rounded-lg bg-input px-4 py-3"
                  placeholder="Album (nếu có)"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Thể loại
                </label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="w-full rounded-lg bg-input px-4 py-3"
                >
                  <option>Pop</option>
                  <option>Hip-hop/Rap</option>
                  <option>Remix</option>
                  <option>R&B</option>
                  <option>EDM</option>
                  <option>Ballad</option>
                  <option>Vinahouse</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Mô tả / Lời bài hát
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-input px-4 py-3 resize-none"
              />
            </div>
          </section>

          {/* Audio */}
          <section>
            <h3 className="text-lg font-semibold border-b border-border pb-2">
              File nhạc
            </h3>

            <div className="pt-5">
              <AudioDropzone
                audioFile={audioFile}
                audioMeta={audioMeta}
                onChange={handleAudioChange}
                onRemove={() => handleAudioChange(null)}
                containerRef={audioDropRef}
                error={error}
              />
            </div>
          </section>

          {/* Status */}
          {status === "uploading" && (
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-primary transition-all"
              />
            </div>
          )}

          {status === "success" && (
            <p className="text-green-500 text-sm">Tải lên thành công.</p>
          )}

          {status === "error" && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {status === "draftSaved" && (
            <p className="text-yellow-400 text-sm">Đã lưu nháp.</p>
          )}

          {/* Action */}
          <div className="pt-6 border-t border-border flex justify-end">
            <button
              onClick={upload}
              className="px-8 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">publish</span>
              Tải lên ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
