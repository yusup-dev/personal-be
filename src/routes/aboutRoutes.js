import express from "express";
import {
  getAbout,
  updateAbout, downloadResume
} from "../controllers/aboutController.js";
import { upload } from "../middlewares/pdfMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", getAbout);
router.get("/:id/download", downloadResume);

router.use(protect)
router.patch("/:id", upload.single("pdf"), updateAbout);

export default router;