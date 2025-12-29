import React, { useRef, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import UserProfileModal from './UserProfileModal';

export default function AvatarMenu() {
  const { user, signOut } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleDoc);
    return () => document.removeEventListener('click', handleDoc);
  }, []);

  const displayInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold"
        aria-expanded={open}
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="avatar" className="h-full w-full rounded-full object-cover" />
        ) : (
          <span>{displayInitial}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card border border-border/60 rounded-md shadow-lg z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-muted/10"
            onClick={() => {
              setShowProfile(true);
              setOpen(false);
            }}
          >
            Hồ sơ người dùng
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-muted/10"
            onClick={() => {
              signOut();
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}

      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}