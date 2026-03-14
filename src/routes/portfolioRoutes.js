import express from "express";

const router = express.Router();

import { createPortfolio } from "../controllers/portfolioController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.use(protect)

router.post("/", createPortfolio);

export default router;