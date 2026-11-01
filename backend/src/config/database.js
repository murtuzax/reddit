import { neon } from '@neondatabase/serverless';
import dotenv from "dotenv"

dotenv.config()

if(!process.env.DATABASE_URL) {
    throw new Error("Database url not found")
}

export const sql = neon(process.env.DATABASE_URL)