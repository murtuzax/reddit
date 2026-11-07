import { sql } from "../config/database.js"

export const getPosts = async (req, res) => {
    try {
        const posts = await sql`
            SELECT * FROM posts LIMIT 20 
        `

        res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: posts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            })
        }

        const post = await sql`
            SELECT * FROM posts WHERE id=${postId}
        `

        if (post.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No post found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post[0]
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const createPost = async (req, res) => {
    try {
        const userId = req.user.id
        const { title, body, community_id } = req.body

        if (!title || !body || !community_id) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            })
        }

        const community = await sql`
            SELECT 1 FROM communities WHERE id=${community_id}
        `

        if (community.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Community"
            })
        }

        const post = await sql`
            INSERT INTO posts(author_id, title, body, community_id)
            VALUES(${userId}, ${title}, ${body}, ${community_id} )
            RETURNING *
        `

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post[0]
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params
        const userId = req.user.id

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            })
        }

        const post = await sql`
            DELETE FROM posts WHERE id=${postId} AND author_id=${userId}
            RETURNING *
        `

        if (post.length === 0) {
            return res.json({
                success: false,
                message: "Post not deleted",
            })
        }

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const postVote = async (req, res) => {
    try {
        const userId = req.user.id
        const postId = req.params.postId
        const value = req.body.value

        if (!userId || !postId || [0, 1, -1].includes(value)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Inputs"
            })
        }

        const posts = await sql`
            SELECT id
            FROM posts
            WHERE id = ${postId}
            LIMIT 1
        `;

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const existingVote = await sql`
            SELECT value FROM votes WHERE post_id=${postId} AND user_id=${userId}
        `

        let newVote = existingVote === value ? 0 : value


        if (newVote === 0) {
            await sql`
                DELETE FROM votes
                WHERE post_id = ${postId}
                AND user_id = ${userId}
            `

        } else {
            await sql`
                INSERT INTO votes (user_id, post_id, value)
                VALUES (${userId}, ${postId}, ${newVote})
                ON CONFLICT (user_id, post_id)
                DO UPDATE SET value = EXCLUDED.value
            `
        }

        return res.status(200).json({
            success: true,
            vote: newVote
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        console.log(error)
    }
}