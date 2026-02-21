import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"
import { CreateSubAlbumRequest, SubAlbum } from "@/lib/subalbum-types"

export const runtime = "edge"

// GET /api/subalbums - List all sub-albums for user with optional date range filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const fromDate = searchParams.get("from")
    const toDate = searchParams.get("to")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Simple query without dynamic parameters for now
    const result = await sql`
      SELECT 
        sa.id,
        sa.user_id,
        sa.title,
        sa.description,
        sa.start_date,
        sa.end_date,
        sa.tags,
        sa.visibility,
        sa.cover_image_id,
        sa.created_at,
        sa.updated_at,
        sa.created_by,
        COUNT(sai.id)::INTEGER as image_count
      FROM sub_albums sa
      LEFT JOIN sub_album_images sai ON sa.id = sai.sub_album_id
      WHERE sa.user_id = ${userId}
      GROUP BY sa.id
      ORDER BY sa.start_date DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `

    const subAlbums: SubAlbum[] = result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      title: row.title as string,
      description: row.description as string | undefined,
      start_date: row.start_date as string | undefined,
      end_date: row.end_date as string | undefined,
      tags: (row.tags as string[]) || [],
      visibility: row.visibility as "private" | "link" | "public",
      cover_image_id: row.cover_image_id as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      created_by: row.created_by as string,
      image_count: (row.image_count as number) || 0,
    }))

    return NextResponse.json({ subAlbums, page, total: result.rowCount })
  } catch (error) {
    console.error("Error listing sub-albums:", error)
    return NextResponse.json(
      { error: "Failed to list sub-albums" },
      { status: 500 }
    )
  }
}

// POST /api/subalbums - Create a new sub-album
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateSubAlbumRequest & { userId: string }
    const {
      userId,
      title,
      description,
      start_date,
      end_date,
      tags = [],
      visibility = "private",
    } = body

    if (!userId || !title) {
      return NextResponse.json(
        { error: "userId and title are required" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO sub_albums (user_id, title, description, start_date, end_date, tags, visibility, created_by)
      VALUES (${userId}, ${title}, ${description || null}, ${start_date || null}, ${end_date || null}, ${JSON.stringify(tags)}, ${visibility}, ${userId})
      RETURNING *
    `

    const subAlbum = result.rows[0] as unknown as SubAlbum

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'create', 'sub_album', ${subAlbum.id}, ${JSON.stringify({ title })})
    `

    return NextResponse.json(subAlbum, { status: 201 })
  } catch (error) {
    console.error("Error creating sub-album:", error)
    return NextResponse.json(
      { error: "Failed to create sub-album" },
      { status: 500 }
    )
  }
}
