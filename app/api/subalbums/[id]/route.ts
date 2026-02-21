import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"
import { SubAlbum, UpdateSubAlbumRequest } from "@/lib/subalbum-types"

export const runtime = "edge"

// GET /api/subalbums/:id - Get sub-album details with images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
        sa.created_by
      FROM sub_albums sa
      WHERE sa.id = ${id}
    `

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Sub-album not found" }, { status: 404 })
    }

    const subAlbum = result.rows[0] as unknown as SubAlbum

    // Get images in this album
    const imagesResult = await sql`
      SELECT i.* FROM images i
      JOIN sub_album_images sai ON i.id = sai.image_id
      WHERE sai.sub_album_id = ${id}
      ORDER BY sai.position ASC, sai.added_at DESC
    `

    return NextResponse.json({
      ...subAlbum,
      images: imagesResult.rows,
      image_count: imagesResult.rowCount,
    })
  } catch (error) {
    console.error("Error getting sub-album:", error)
    return NextResponse.json(
      { error: "Failed to get sub-album" },
      { status: 500 }
    )
  }
}

// PATCH /api/subalbums/:id - Update sub-album
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as UpdateSubAlbumRequest & { userId: string }
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Check ownership
    const checkResult = await sql`
      SELECT user_id FROM sub_albums WHERE id = ${id}
    `

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: "Sub-album not found" }, { status: 404 })
    }

    const owner = checkResult.rows[0] as Record<string, unknown>
    if (owner.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update only the fields provided
    if (updates.title) {
      await sql`UPDATE sub_albums SET title = ${updates.title}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.description !== undefined) {
      await sql`UPDATE sub_albums SET description = ${updates.description}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.start_date) {
      await sql`UPDATE sub_albums SET start_date = ${updates.start_date}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.end_date) {
      await sql`UPDATE sub_albums SET end_date = ${updates.end_date}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.tags !== undefined) {
      await sql`UPDATE sub_albums SET tags = ${JSON.stringify(updates.tags)}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.visibility) {
      await sql`UPDATE sub_albums SET visibility = ${updates.visibility}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }
    if (updates.cover_image_id) {
      await sql`UPDATE sub_albums SET cover_image_id = ${updates.cover_image_id}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
    }

    const result = await sql`
      SELECT * FROM sub_albums WHERE id = ${id}
    `

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'edit', 'sub_album', ${id}, ${JSON.stringify(updates)})
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating sub-album:", error)
    return NextResponse.json(
      { error: "Failed to update sub-album" },
      { status: 500 }
    )
  }
}

// DELETE /api/subalbums/:id - Delete sub-album
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = (await request.json()) as { userId: string }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Check ownership
    const checkResult = await sql`
      SELECT user_id FROM sub_albums WHERE id = ${id}
    `

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: "Sub-album not found" }, { status: 404 })
    }

    const owner = checkResult.rows[0] as Record<string, unknown>
    if (owner.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete (cascade will handle sub_album_images)
    await sql`
      DELETE FROM sub_albums WHERE id = ${id}
    `

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'delete', 'sub_album', ${id}, null)
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sub-album:", error)
    return NextResponse.json(
      { error: "Failed to delete sub-album" },
      { status: 500 }
    )
  }
}
