import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import songRoute from "./routes/songRoute.js";
import genreRoute from "./routes/genreRoute.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import path from "path";
import uploadRoute from "./routes/uploadRoute.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use((req, res, next) => {
  console.log('REQ', req.method, req.path, 'headers:', { auth: req.headers.authorization ? 'present' : 'none' });
  next();
});

// public routes
app.use('/api/auth', authRoute);
// serve uploads statically
// app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use('/uploads', express.static(uploadsDir));

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// upload endpoint
app.use('/api/upload', uploadRoute);

// songs: some endpoints public (GET), others protected
app.use('/api/songs', songRoute);
// genres: public list/get, admin-only write
app.use('/api/genres', genreRoute);


// private routes
app.use(protectedRoute);
app.use('/api/user', userRoute);


connectDB().then(() => {
// sample route
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});