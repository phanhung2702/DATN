import { useEffect, useRef, useState } from "react";
// import uploadService from "../services/uploadService";
import axios from "axios";
import fileService from "../services/fileService";
import songService from "../services/songService";


export type AudioMeta = { duration?: number; size?: number; format?: string };

export default function useUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioMeta, setAudioMeta] = useState<AudioMeta | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle"|"uploading"|"success"|"error"|"draftSaved">("idle");
  const [error, setError] = useState<string | null>(null);
  const audioDropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!coverFile) { setCoverPreview(null); return; }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!audioFile) { setAudioMeta(null); return; }
    const file = audioFile;
    const format = file.name.split(".").pop()?.toUpperCase() ?? "";
    const size = file.size;
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    const onLoaded = () => { setAudioMeta({ duration: audio.duration, size, format }); URL.revokeObjectURL(audioUrl); };
    const onError = () => { setAudioMeta({ size, format }); URL.revokeObjectURL(audioUrl); };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
    audio.load();
    return () => { audio.removeEventListener("loadedmetadata", onLoaded); audio.removeEventListener("error", onError); };
  }, [audioFile]);

  useEffect(() => {
    const el = audioDropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => { e.preventDefault(); el.classList.add("drag-active"); };
    const onDragLeave = (e: DragEvent) => { e.preventDefault(); el.classList.remove("drag-active"); };
    const onDrop = (e: DragEvent) => { e.preventDefault(); el.classList.remove("drag-active"); const f = e.dataTransfer?.files?.[0]; if (f && f.type.startsWith("audio")) setAudioFile(f); };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => { el.removeEventListener("dragover", onDragOver); el.removeEventListener("dragleave", onDragLeave); el.removeEventListener("drop", onDrop); };
  }, []);

  const reset = () => { setTitle(""); setArtist(""); setAlbum(""); setGenre("Pop"); setDescription(""); setCoverFile(null); setAudioFile(null); setProgress(0); setStatus("idle"); setError(null); };

  const validate = () => {
    if (!title.trim()) return "Vui lòng nhập tên bài hát.";
    if (!artist.trim()) return "Vui lòng nhập tên nghệ sĩ chính.";
    if (!audioFile) return "Vui lòng chọn file nhạc.";
    if (coverFile && coverFile.size > 5 * 1024 * 1024) return "Ảnh bìa không được vượt quá 5MB.";
    if (audioFile && audioFile.size > 200 * 1024 * 1024) return "File nhạc không được vượt quá 200MB.";
    return null;
  };

  const handleCoverChange = (f: File | null) => { if (f && !f.type.startsWith("image")) { setError("Ảnh không hợp lệ."); return; } setCoverFile(f); setError(null); };
  const handleAudioChange = (f: File | null) => { if (f && !f.type.startsWith("audio")) { setError("File không phải file âm thanh hợp lệ."); return; } setAudioFile(f); setError(null); };

  const saveDraft = () => {
    const err = validate();
    if (err && (!title.trim() || !artist.trim())) { setError(err); return; }
    const draft = { title, artist, album, genre, description, coverName: coverFile?.name ?? null, audioName: audioFile?.name ?? null, updatedAt: new Date().toISOString() };
    localStorage.setItem("admin_upload_draft", JSON.stringify(draft));
    setStatus("draftSaved");
    setTimeout(() => setStatus("idle"), 1500);
  };

  const upload = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!audioFile) return;

    try {
      setStatus("uploading"); setProgress(0); setError(null);

      // 1) upload files -> get URLs
      const filesForm = new FormData();
      filesForm.append("audio", audioFile);
      if (coverFile) filesForm.append("cover", coverFile);

      const uploadRes = await fileService.uploadFiles(filesForm, (p) => setProgress(p));
      const audioUrl: string = uploadRes.audioUrl ?? uploadRes.url ?? "";
      const coverUrl: string | undefined = uploadRes.coverUrl;

      if (!audioUrl) throw new Error("Không nhận được URL file âm thanh từ server.");

      // 2) create song record with returned urls
      const payload = {
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim() || undefined,
        genre: genre || undefined,
        lyrics: description || undefined,
        url: audioUrl,
        coverUrl: coverUrl,
        duration: audioMeta?.duration,
      };

      await songService.createSong(payload);
      setStatus("success");
      setTimeout(reset, 1000);
    } catch (e: unknown) {
  setStatus("error");

  if (axios.isAxiosError(e)) {
    setError(e.response?.data?.message ?? "Lỗi khi tải lên.");
  } else if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("Lỗi khi tải lên.");
  }
    }
  };

  return {
    title, setTitle, artist, setArtist, album, setAlbum, genre, setGenre, description, setDescription,
    coverFile, coverPreview, audioFile, audioMeta, progress, status, error,
    audioDropRef, reset, validate, handleCoverChange, handleAudioChange, saveDraft, upload
  } as const;
}