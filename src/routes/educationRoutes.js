import express from "express";

const router = express.Router();

import { protect } from "../middlewares/authMiddleware.js";
import { createEducation, getAllEducation, updateEducation, deleteEducation } from "../controllers/educationController.js";

router.get("/", getAllEducation)

router.use(protect)

router.post("/", createEducation);
router.patch("/:id", updateEducation);
router.delete("/:id", deleteEducation);


export default router;