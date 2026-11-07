import {Router} from "express"
import { verifyUser } from "../middlewares/authMiddleware.js"
import { createCommunity, deleteCommunity, getCommunities } from "../controllers/communityController.js"

const router = Router()

router.get("/", verifyUser ,getCommunities)

router.post('/', verifyUser, createCommunity)

router.delete("/:communityId", verifyUser, deleteCommunity)

export default router