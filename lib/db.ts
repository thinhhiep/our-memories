import { Pool, QueryResult } from "@neondatabase/serverless"

/**
 * Database connection using Neon Serverless
 * Environment variable: DATABASE_URL
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const sql = async (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => {
  const query = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "")
  return pool.query(query, values)
}

export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    const result = await pool.query(`
      CREATE TABLE IF NOT EXISTS sub_albums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        visibility TEXT DEFAULT 'private', -- 'private', 'link', 'public'
        cover_image_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        INDEX idx_user_id (user_id),
        INDEX idx_start_date (start_date),
        INDEX idx_visibility (visibility)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        url TEXT NOT NULL,
        thumb_url TEXT,
        caption TEXT,
        date DATE,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        metadata JSONB,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_date (date)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS sub_album_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL REFERENCES sub_albums(id) ON DELETE CASCADE,
        image_id TEXT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        position INTEGER,
        added_by TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sub_album_id, image_id),
        INDEX idx_sub_album_id (sub_album_id),
        INDEX idx_image_id (image_id)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS share_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL REFERENCES sub_albums(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        expires_at TIMESTAMP,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token (token),
        INDEX idx_sub_album_id (sub_album_id)
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL, -- 'create', 'edit', 'delete', 'share'
        resource_type TEXT NOT NULL, -- 'sub_album', 'image'
        resource_id TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      );
    `

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

export { sql }
