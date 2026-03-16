import express from "express";

const router = express.Router();

import { protect } from "../middlewares/authMiddleware.js";
import { createExperience, deleteExperience, getAllExperience, updateExperience } from "../controllers/experienceController.js";

router.get("/", getAllExperience)

router.use(protect)

router.post("/", createExperience);
router.patch("/:id", updateExperience);
router.delete("/:id", deleteExperience);


export default router;