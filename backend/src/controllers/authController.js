import { sql } from "../config/database.js"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

export const handleRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const userExists = await sql`
            SELECT * FROM users WHERE username=${username} OR email=${email}
        `

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User is already registered"
            })
        }

        const hashedPassword = await argon2.hash(password)

        const user = await sql`
            INSERT INTO users(username, email, password)
            VALUES (${username}, ${email}, ${hashedPassword})
            RETURNING id
        `

        const accessToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { id: user[0].id },
            accessToken: accessToken
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
        console.log(error)
    }
}

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await sql`
            SELECT id, password FROM users WHERE email=${email}
        `

        if (user.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const passwordMatches = await argon2.verify(user[0].password, password)

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const accessToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const refreshToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

                res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: { id: user[0].id },
            accessToken: accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
        console.log(error)
    }
}

export const meHandler = async(req, res) => {
    try {
        const userId = req.user.id

        const user = await sql`
            SELECT id, username, email FROM users WHERE id=${userId}
        `
        if(user.length===0) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"User returned successfully",
            data:{
                id:user[0].id,
                username:user[0].username,
                email:user[0].email
            }
        })
    } catch (error) {
                res.status(500).json({
            message: "Internal server error",
            success: false
        })
        console.log(error)
    }
}

// Implement refresh token saving 