export type User = {
  likedSongs?: string[];
  _id?: string;
  username?: string;
  email?: string;
  displayName?: string; // backend dùng displayName
  avatarUrl?: string;
  avatarId?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};