import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/database.js"
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import communitiesRouter from "./routes/communitiesRoutes.js"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(morgan("dev"))
app.use(cookieParser())

app.use("/api/auth", authRoutes)

app.use("/api/posts", postRoutes)

app.use("/api/communities", communitiesRouter)

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

        await sql`
        CREATE TABLE IF NOT EXISTS communities(
            id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,

            author_id UUID NOT NULL,

            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),

            FOREIGN KEY(author_id) REFERENCES users(id)
        )
    `

    await sql`
        CREATE TABLE IF NOT EXISTS posts(
            id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
            author_id UUID NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            community_id UUID,

            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),

            FOREIGN KEY(author_id) REFERENCES users(id),
            FOREIGN KEY(community_id) REFERENCES communities(id)
        )
    `

    await sql`
        CREATE TABLE IF NOT EXISTS votes(
            user_id UUID  NOT NULL,
            post_id UUID  NOT NULL,
            value INT,

            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(post_id) REFERENCES posts(id),

            UNIQUE(user_id, post_id)
        )
    `
}

initDB()

app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
})