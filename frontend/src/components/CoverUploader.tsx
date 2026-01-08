import React from "react";

export default function CoverUploader({ preview, onChange }: { preview: string | null; onChange: (f: File | null) => void; }) {
  return (
    <label className="relative group aspect-square w-full rounded-2xl border-2 border-dashed border-surface-dark bg-[#16161d] hover:border-primary/50 hover:bg-[#1a1a24] flex flex-col items-center justify-center text-center p-6 overflow-hidden cursor-pointer">
      {preview ? <img src={preview} alt="cover" className="object-cover w-full h-full rounded-2xl" /> : (
        <>
          <div className="bg-surface-dark p-4 rounded-full mb-3"><span className="material-symbols-outlined text-3xl text-text-secondary">image</span></div>
          <p className="text-white font-medium text-sm">Tải ảnh lên</p>
          <p className="text-text-secondary text-xs mt-1">JPEG, PNG (Tối đa 5MB)</p>
        </>
      )}
      <input accept="image/*" onChange={(e)=> onChange(e.target.files?.[0] ?? null)} className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
    </label>
  );
}