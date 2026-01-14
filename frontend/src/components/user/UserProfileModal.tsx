import React from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserProfileModal({ isOpen, onClose }: Props) {
  const { user } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-70 w-full max-w-lg bg-white dark:bg-card rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold">Hồ sơ người dùng</h3>
          <button onClick={onClose} className="text-muted-foreground">Đóng</button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center text-2xl">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="h-full w-full rounded-full object-cover" /> : (user?.displayName?.charAt(0).toUpperCase() ?? 'U')}
          </div>
          <div>
            <div className="font-semibold">{user?.displayName ?? user?.username}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div><span className="text-muted-foreground">Tên đăng nhập: </span>{user?.username}</div>
          <div><span className="text-muted-foreground">Email: </span>{user?.email}</div>
          <div><span className="text-muted-foreground">Ngày tạo: </span>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
        </div>
      </div>
    </div>
  );
}