import express from "express";

const router = express.Router();

import { createPortfolio, deletePortfolio, getAllPortfolio, updatePortfolio } from "../controllers/portfolioController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", getAllPortfolio)

router.use(protect)

router.post("/", createPortfolio);
router.patch("/:id", updatePortfolio);
router.delete("/:id", deletePortfolio);


export default router;