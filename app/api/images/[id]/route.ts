import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"
import { Image } from "@/lib/subalbum-types"

export const runtime = "edge"

// PATCH /api/images/:id - Update image metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as {
      caption?: string
      date?: string
      tags?: string[]
      metadata?: Record<string, unknown>
      userId: string
    }

    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Check ownership
    const checkResult = await sql`
      SELECT user_id FROM images WHERE id = ${id}
    `

    if ((checkResult.rowCount || 0) === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const image = checkResult.rows[0] as Record<string, unknown>
    if (image.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update image
    if (updates.caption !== undefined) {
      await sql`UPDATE images SET caption = ${updates.caption} WHERE id = ${id}`
    }
    if (updates.date !== undefined) {
      await sql`UPDATE images SET date = ${updates.date} WHERE id = ${id}`
    }
    if (updates.tags !== undefined) {
      await sql`UPDATE images SET tags = ${JSON.stringify(updates.tags)} WHERE id = ${id}`
    }
    if (updates.metadata !== undefined) {
      await sql`UPDATE images SET metadata = ${JSON.stringify(updates.metadata)} WHERE id = ${id}`
    }

    const result = await sql`
      SELECT * FROM images WHERE id = ${id}
    `

    return NextResponse.json(result.rows[0] as Image)
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    )
  }
}

// DELETE /api/images/:id - Delete image and remove from all albums
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
      SELECT user_id FROM images WHERE id = ${id}
    `

    if ((checkResult.rowCount || 0) === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const image = checkResult.rows[0] as Record<string, unknown>
    if (image.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete image (cascade will remove from albums)
    await sql`
      DELETE FROM images WHERE id = ${id}
    `

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'delete', 'image', ${id}, null)
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}
