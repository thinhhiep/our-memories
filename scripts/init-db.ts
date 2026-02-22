import { sql } from "@vercel/postgres"
import dotenv from "dotenv"
import path from "path"

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

/**
 * Database initialization script
 * Run with: npm run init-db
 */

async function initializeDatabase() {
  try {
    // Check if DATABASE_URL or POSTGRES_URL is set
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (!dbUrl) {
      console.error("❌ Error: DATABASE_URL or POSTGRES_URL environment variable not set")
      console.error("   Please check your .env.local file")
      process.exit(1)
    }

    console.log("🔄 Initializing database tables...")

    // Create sub_albums table
    console.log("📊 Creating sub_albums table...")
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
    console.log("🖼️  Creating images table...")
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
    console.log("🔗 Creating sub_album_images junction table...")
    await sql`
      CREATE TABLE IF NOT EXISTS sub_album_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL REFERENCES sub_albums(id) ON DELETE CASCADE,
        image_id TEXT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
        position INT DEFAULT 0,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sub_album_id, image_id)
      )
    `

    // Create share_tokens table for public sharing
    console.log("🔐 Creating share_tokens table...")
    await sql`
      CREATE TABLE IF NOT EXISTS share_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sub_album_id UUID NOT NULL REFERENCES sub_albums(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `

    // Create audit_logs table for activity tracking
    console.log("📝 Creating audit_logs table...")
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        changes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes for better query performance
    console.log("⚡ Creating indexes...")
    await sql`CREATE INDEX IF NOT EXISTS idx_sub_albums_user_id ON sub_albums(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sub_album_images_album ON sub_album_images(sub_album_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_sub_album_images_image ON sub_album_images(image_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_share_tokens_token ON share_tokens(token)`
    await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`

    console.log("✅ Database initialization completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

initializeDatabase()
