import {Router} from "express"
import { createPost, deletePost, getPost, getPosts } from "../controllers/postController.js"
import { verifyUser } from "../middlewares/authMiddleware.js"

const router = Router()

router.get("/", getPosts)

router.post('/', verifyUser, createPost)

router.get("/:postId", getPost)

router.delete("/:postId", verifyUser, deletePost)

export default router