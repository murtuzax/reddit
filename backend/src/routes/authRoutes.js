import {Router} from "express"
import { handleLogin, handleRefresh, handleRegister, meHandler } from "../controllers/authController.js"
import { verifyUser } from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/register", handleRegister)

router.post("/login", handleLogin)

router.post("/refresh", handleRefresh)

router.get("/me", verifyUser, meHandler)

export default router