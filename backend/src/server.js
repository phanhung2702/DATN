import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import songRoute from "./routes/songRoute.js";
import genreRoute from "./routes/genreRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import path from "path";
import fs from "fs"; // Thêm fs để kiểm tra thư mục
import uploadRoute from "./routes/uploadRoute.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Định nghĩa đường dẫn tuyệt đối đến thư mục uploads (backend/public/uploads)
const UPLOADS_PATH = path.join(__dirname, "..", "public", "uploads");

// 2. Tự động tạo thư mục nếu chưa có để tránh lỗi khi upload lần đầu
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
  console.log("Created uploads directory at:", UPLOADS_PATH);
}

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(express.json());
app.use(cookieParser());

// Cấu hình CORS (Đảm bảo origin đúng với URL của Frontend)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Log tất cả request để debug (Giữ nguyên cái này của bạn rất tốt)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, { 
    auth: req.headers.authorization ? 'present' : 'none' 
  });
  next();
});

// --- ROUTES ---

// 3. PHỤC VỤ FILE TĨNH (Phải đặt TRƯỚC các route bảo mật)
// Khi truy cập http://localhost:3000/uploads/image.jpg -> Nó sẽ tìm trong UPLOADS_PATH
app.use('/uploads', (req, res, next) => {
    // Log này sẽ chạy mỗi khi bạn truy cập vào link ảnh
    const fullPath = path.join(UPLOADS_PATH, req.path);
    console.log("-----------------------------------------");
    console.log("Yêu cầu file:", req.path);
    console.log("Express đang tìm file tại đường dẫn thực tế này:");
    console.log(fullPath);
    console.log("File có tồn tại không?", fs.existsSync(fullPath));
    console.log("-----------------------------------------");
    next();
}, express.static(UPLOADS_PATH));

// Public API routes
app.use('/api/auth', authRoute);
app.use('/api/songs', songRoute);
app.use('/api/genres', genreRoute);
app.use('/api/playlists', playlistRoute);
// Upload API route
app.use('/api/upload', uploadRoute);

// 4. PRIVATE ROUTES (Các route bên dưới này mới cần Token)
app.use(protectedRoute); 
app.use('/api/user', userRoute);

// --- START SERVER ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📁 Static files served from: ${UPLOADS_PATH}`);
  });
});