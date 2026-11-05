import { sql } from "../config/database.js"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import crypto from "crypto"

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

        const refreshToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        await sql`
            INSERT INTO sessions(user_id, refresh_token_hash, ip, user_agent)
            VALUES(${user[0].id}, ${refreshTokenHash}, ${req.ip}, ${req.headers["user-agent"]})
        `

        const accessToken = jwt.sign({
            id: user[0].id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
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

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        await sql`
            INSERT INTO sessions(user_id, refresh_token_hash, ip, user_agent)
            VALUES(${user[0].id}, ${refreshTokenHash}, ${req.ip}, ${req.headers["user-agent"]})
        `


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

export const meHandler = async (req, res) => {
    try {
        const userId = req.user.id

        const user = await sql`
            SELECT id, username, email FROM users WHERE id=${userId}
        `
        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User returned successfully",
            data: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email
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

export const handleRefresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Request token not found"
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session = await sql`
            SELECT 1 FROM sessions WHERE refresh_token_hash=${refreshTokenHash} AND revoked=false
        `

        if(session.length===0) {
            return res.status(401).json({
                success:false,
                message:"Invalid Refresh Token"
            })
        }

        const accessToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        })

        const newRefreshToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")


        await sql`
            UPDATE sessions
            SET refresh_token_hash=${newRefreshTokenHash}
            WHERE refresh_token_hash=${refreshTokenHash}
        `

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
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

export const handleLogout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found"
            })
        }

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        const session = await sql`
            SELECT 1 FROM sessions WHERE refresh_token_hash=${refreshTokenHash}
        `

        if(session.length===0) {
            return res.status(404).json({
                success:false
            })
        }

        await sql`
            UPDATE sessions
            SET revoked=true
            WHERE refresh_token_hash=${refreshTokenHash}
        `

        res.clearCookie("refreshToken")

        res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
        console.log(error)
    }
}
