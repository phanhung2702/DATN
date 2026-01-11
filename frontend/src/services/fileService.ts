import axios from "../lib/axios";
import type { AxiosProgressEvent } from "axios";


export default {
  uploadFiles: async (
    formData: FormData,
    onProgress?: (percent: number) => void
  ) => {
    const res = await axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (!e.total) return;
        const pct = Math.round((e.loaded * 100) / e.total);
        onProgress?.(pct);
      },
    });

    return res.data;
  },
};
