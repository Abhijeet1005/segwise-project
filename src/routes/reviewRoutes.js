import { Router } from "express";
import { JWTcheck } from "../middlewares/authMiddleware.js";
import { getReviewCountsAndTrends } from "../controllers/reviewControllers.js";

const router = Router()

router.route('/countAndTrends').get(JWTcheck, getReviewCountsAndTrends)

export default router