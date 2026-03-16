import express from "express";
import {
  getAbout,
  updateAbout
} from "../controllers/aboutController.js";
import { upload } from "../middlewares/pdfMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", getAbout);

router.use(protect)
router.patch("/:id", upload.single("pdf"), updateAbout);

export default router;