import { sql } from "../config/database.js"

export const getCommunities = async(req, res) => {
    try {
        const communities = await sql`
            SELECT * FROM communities LIMIT 20
        `

        res.status(200).json({
            success:true,
            message:"Communities fetched successfully",
            data:communities
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const createCommunity = async(req, res) => {
    try {
        const userId = req.user.id
        const {name, slug, description} = req.body

        if(!name || !slug || !description) {
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            })
        }

        const community = await sql`
            SELECT 1 FROM communities WHERE slug=${slug}
        `

        if(community.length!=0) {
            return res.status(401).json({
                success:false,
                message:"Community with same slug already exists"
            })
        }

        const newCommunity = await sql`
            INSERT INTO communities(author_id, name, slug, description)
            VALUES(${userId}, ${name}, ${slug}, ${description} )
            RETURNING *
        `

        res.status(201).json({
            success:true,
            message:"Community created successfully",
            data:newCommunity[0]
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const deleteCommunity = async(req, res) => {
    try {
        const {communityId} = req.params
        const userId = req.user.id

        if(!communityId) {
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            })
        }

        const community = await sql`
            DELETE FROM communities WHERE id=${communityId} AND author_id=${userId}
            RETURNING *
        `

        if(community.length===0) {
            return res.json({
            success:false,
            message:"Post not deleted",
        })
        }

        res.status(200).json({
            success:true,
            message:"Community deleted successfully",
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}