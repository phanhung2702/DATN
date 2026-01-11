// src/services/userService.ts
import axios from "../lib/axios";

export type User = {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};


export type GetUsersResponse = {
  items: User[];
  total?: number;
};

// Lấy danh sách người dùng với phân trang
export const getUsers = async (page = 1, limit = 12): Promise<GetUsersResponse> => {
  const res = await axios.get("/user", { params: { page, limit } });
  return res.data;
};
