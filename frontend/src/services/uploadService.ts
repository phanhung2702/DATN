import axios from "../lib/axios";

export default {
  uploadTrack: async (formData: FormData, onProgress?: (percent: number) => void) => {
    const res = await axios.post("/admin/tracks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const pct = Math.round((e.loaded * 100) / (e.total ?? 1));
        onProgress?.(pct);
      }
    });
    return res.data;
  }
};