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
            avatar_ulr TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `
}

initDB()

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
})