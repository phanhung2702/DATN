import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadFiles } from '../controllers/uploadController.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
console.log("Multer will save files to:", uploadsDir);

// ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

router.post('/', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), uploadFiles);

export default router;