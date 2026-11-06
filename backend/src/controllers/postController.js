import { sql } from "../config/database.js"

export const getPosts = async(req, res) => {
    try {
        const posts = await sql`
            SELECT * FROM posts LIMIT 20
        `

        if(posts.length===0) {
            return res.status(404).json({
                success:false,
                message:"Posts not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Posts fetched successfully",
            data:posts
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const getPost = async(req, res) => {
    try {
        const {postId} = req.params

        if(!postId) {
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            })
        }

        const post = await sql`
            SELECT * FROM posts WHERE id=${postId}
        `

        if(post.length===0) {
            return res.status(404).json({
                success:false,
                message:"No post found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Post fetched successfully",
            data:post[0]
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const createPost = async(req, res) => {
    try {
        const userId = req.user.id
        const {title, body} = req.body

        if(!title || !body) {
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            })
        }

        const post = await sql`
            INSERT INTO posts(author_id, title, body)
            VALUES(${userId}, ${title}, ${body} )
            RETURNING *
        `

        res.status(201).json({
            success:true,
            message:"Post created successfully",
            data:post[0]
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const deletePost = async(req, res) => {
    try {
        const {postId} = req.params
        const userId = req.user.id

        if(!postId) {
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            })
        }

        const post = await sql`
            DELETE FROM posts WHERE id=${postId} AND author_id=${userId}
            RETURNING *
        `

        if(post.length===0) {
            return res.json({
            success:false,
            message:"Post not deleted",
        })
        }

        res.status(200).json({
            success:true,
            message:"Post deleted successfully",
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}