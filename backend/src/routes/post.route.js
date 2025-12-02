import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  getPostMedia,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

// setup multer temp storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

router.post("/", protectRoute, upload.single("file"), createPost);
router.get("/", protectRoute, getAllPosts);
router.get("/:id/media",  getPostMedia);
router.put("/:postId/like", protectRoute, toggleLike);

export default router;
