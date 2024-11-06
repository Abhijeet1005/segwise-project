import { Router } from "express";
import { JWTcheck } from "../middlewares/authMiddleware.js";
import { getUser, loginUser, logoutUser, RegisterUser } from "../controllers/userControllers.js";
const router = Router()

router.route('/').get(JWTcheck, getUser)
router.route('/register').post(RegisterUser)
router.route('/login').post(loginUser)
router.route('/logout').post(JWTcheck, logoutUser)


export default router