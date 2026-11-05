import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/database.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/auth", authRoutes)

async function initDB() {
    await sql`
        CREATE TABLE IF NOT EXISTS users(
            id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            display_name TEXT,
            bio TEXT,
            avatar_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `
    await sql`
        CREATE TABLE IF NOT EXISTS sessions(
            user_id UUID NOT NULL,

            refresh_token_hash TEXT NOT NULL,
            ip TEXT NOT NULL,
            user_agent TEXT NOT NULL,
            revoked BOOLEAN NOT NULL DEFAULT FALSE,

            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),

            FOREIGN KEY(user_id) REFERENCES users(id)

        )
    `
}

initDB()

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
})