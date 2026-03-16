import express from "express";
import {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
  getPostImage
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);

router.get("/:id", getPost);

router.get("/:id/image", getPostImage);

router.use(protect);

router.post("/", upload.single("image"), createPost);

router.patch("/:id", upload.single("image"), updatePost);

router.delete("/:id", deletePost);

export default router;
