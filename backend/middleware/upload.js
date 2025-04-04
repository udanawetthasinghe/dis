// backend/middleware/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the UPLOADS_PATH from .env; if not set, default to a local uploads folder
const uploadDirectory = process.env.UPLOADS_PATH || path.join(__dirname, '..', 'uploads');


// Option 1: Using an 'uploads' folder inside the backend folder
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // This will set the destination to: project/backend/uploads
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
export default upload;
