import express from "express";

const router = express.Router();

import { protect } from "../middlewares/authMiddleware.js";
import { createSkill, deleteSkill, getAllSkills, updateSkill } from "../controllers/skillController.js";

router.get("/", getAllSkills)

router.use(protect)

router.post("/", createSkill);
router.patch("/:id", updateSkill);
router.delete("/:id", deleteSkill);


export default router;