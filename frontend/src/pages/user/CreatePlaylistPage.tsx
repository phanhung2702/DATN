import { useState } from "react";
import { ImagePlus} from "lucide-react";
import PageTitle from "@/components/PageTitle";

export default function CreatePlaylistPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
//   const [isPublic, setIsPublic] = useState(true);
  const [cover, setCover] = useState<string | null>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(URL.createObjectURL(file));
  }

  return (
    <div className="px-10 py-8">
      <PageTitle>Tạo danh sách phát</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* ===== Cover ===== */}
        <div>
          <label className="block aspect-square rounded-xl bg-muted flex items-center justify-center cursor-pointer overflow-hidden hover:opacity-90 transition">
            {cover ? (
              <img src={cover} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImagePlus size={32} />
                <span className="text-sm mt-2">Thêm ảnh bìa</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverChange}
            />
          </label>
        </div>

        {/* ===== Info ===== */}
        <div className="md:col-span-2 space-y-6">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Tên playlist</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist yêu thích của tôi"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Một vài dòng mô tả về playlist này..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Privacy */}
          {/* <div>
            <label className="text-sm font-medium mb-2 block">
              Quyền riêng tư
            </label>
            <div className="flex gap-3">
              <PrivacyOption
                active={isPublic}
                icon={<Globe />}
                title="Công khai"
                desc="Ai cũng có thể xem"
                onClick={() => setIsPublic(true)}
              />
              <PrivacyOption
                active={!isPublic}
                icon={<Lock />}
                title="Riêng tư"
                desc="Chỉ mình bạn"
                onClick={() => setIsPublic(false)}
              />
            </div>
          </div> */}

          {/* Action */}
          <div className="pt-4 flex justify-end gap-3">
            <button className="px-6 py-3 rounded-lg border border-border hover:bg-muted/40 transition">
              Hủy
            </button>
            <button
              disabled={!name}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
            >
              Tạo playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Privacy Card ===== */

// function PrivacyOption({
//   active,
//   icon,
//   title,
//   desc,
//   onClick,
// }: {
//   active: boolean;
//   icon: React.ReactNode;
//   title: string;
//   desc: string;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 p-4 rounded-xl border transition w-full
//         ${
//           active
//             ? "border-primary bg-primary/10"
//             : "border-border hover:bg-muted/40"
//         }`}
//     >
//       <div className="text-primary">{icon}</div>
//       <div className="text-left">
//         <div className="font-medium">{title}</div>
//         <div className="text-sm text-muted-foreground">{desc}</div>
//       </div>
//     </button>
//   );
// }
