import { sql } from "@vercel/postgres"

/**
 * Database initialization script
 * Run this once to create tables
 */

export async function initializeDatabase() {
  try {
    console.log("Creating database tables...")

    // Create sub_albums table
    await sql`
      CREATE TABLE IF NOT EXISTS sub_albums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        visibility TEXT DEFAULT 'private',
        cover_image_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT
      )
    `

    // Create images table
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
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create sub_album_images junction table
    await sql`
      CREATE TABLE IF NOT EXISTS sub_album_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL,
        image_id TEXT NOT NULL,
        position INTEGER,
        added_by TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create share_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS share_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL,
        token TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        expires_at TIMESTAMP,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create audit_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("✅ Database tables created successfully")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    throw error
  }
}
