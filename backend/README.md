# Backend API - SoundWave

This file documents available backend API endpoints.

Authentication

- POST /api/auth/signup — register new user
- POST /api/auth/signin — login (returns access token)
- POST /api/auth/signout — logout

User

- GET /api/user/me — get current user (protected)
- PUT /api/user/me — update profile (protected)
- PUT /api/user/me/password — change password (protected). Body: `currentPassword`, `newPassword`, `newPasswordConfirm`.
- GET /api/user — list users (admin only). Returns only users with role `user` (admins excluded). Query params: `page`, `limit`.

Songs

- GET /api/songs — list songs (public). Query params: `search`, `artist`, `genre`, `page`, `limit`.
- GET /api/songs/:id — get single song by id (public)
- POST /api/songs — create song (admin only). Body: `title`, `artist`, `url`, optional `album`, `duration`, `coverUrl`, `genre`, `lyrics`.
- PUT /api/songs/:id — update song (uploader or admin). Body: any of `title, artist, album, duration, url, coverUrl, genre, lyrics`.
- DELETE /api/songs/:id — delete song (uploader or admin)

Genres

- GET /api/songs/admin — list all songs (admin only). Query: `page`, `limit`. Returns `uploader` info.
- GET /api/genres — list genres (public)
- GET /api/genres/:id — get genre by id (public)
- POST /api/genres — create genre (admin only). Body: `name`, optional `slug`, `description`.
- PUT /api/genres/:id — update genre (admin only)
- DELETE /api/genres/:id — delete genre (admin only)

Auth header

- For protected endpoints include header: `Authorization: Bearer <ACCESS_TOKEN>`

Notes

- `protectedRoute` middleware validates token and sets `req.user`.
- `adminOnly` middleware restricts write operations to users with `role === 'admin'`.
