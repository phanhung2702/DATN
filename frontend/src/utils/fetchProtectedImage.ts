import axios from "../lib/axios";

export async function fetchProtectedImage(url: string) {
  const res = await axios.get(url, { responseType: "blob" });
  return URL.createObjectURL(res.data);
}