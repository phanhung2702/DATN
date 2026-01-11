import React, { useEffect, useState } from "react";
import { getUsers, type User } from "../../services/userService";




export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers(page, limit);
        if (!mounted) return;
       setUsers(data.items ?? [])
      } catch (e: any) {
        setError(e?.message ?? "Lỗi khi tải danh sách người dùng");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Người dùng</h1>
        <div className="text-sm text-muted-foreground">Tổng: {users.length}</div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Đang tải...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Username</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Display Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {users.map((user, index) => (
              <tr key={user._id} className="hover:bg-muted/10 transition">
                <td className="px-4 py-2 text-sm">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-2 text-sm">{user.username}</td>
                <td className="px-4 py-2 text-sm">{user.displayName}</td>
                <td className="px-4 py-2 text-sm">{user.email}</td>
                <td className="px-4 py-2 text-sm">{user.role}</td>
                <td className="px-4 py-2 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-input disabled:opacity-50"
        >
          Trước
        </button>
        <div className="text-sm">Trang {page}</div>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 rounded bg-input"
        >
          Tiếp
        </button>
      </div>
    </div>
  );
}
