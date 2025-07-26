import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL exists, if not provide a fallback or throw a helpful error
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please add Neon integration to your project.")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }
