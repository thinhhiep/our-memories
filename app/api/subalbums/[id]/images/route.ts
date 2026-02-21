import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// POST /api/subalbums/:id/images - Add images to sub-album
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as { imageIds: string[]; userId: string }

    const { imageIds, userId } = body

    if (!userId || !imageIds || imageIds.length === 0) {
      return NextResponse.json(
        { error: "userId and imageIds are required" },
        { status: 400 }
      )
    }

    // Check if user owns the album
    const albumCheck = await sql`
      SELECT user_id FROM sub_albums WHERE id = ${id}
    `

    if (albumCheck.rowCount === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    const album = albumCheck.rows[0] as Record<string, unknown>
    if (album.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Add images to album
    const results = []
    for (let i = 0; i < imageIds.length; i++) {
      try {
        const result = await sql`
          INSERT INTO sub_album_images (sub_album_id, image_id, position, added_by, added_at)
          VALUES (${id}, ${imageIds[i]}, ${i}, ${userId}, CURRENT_TIMESTAMP)
          ON CONFLICT (sub_album_id, image_id) DO NOTHING
          RETURNING *
        `
        if ((result.rowCount || 0) > 0) {
          results.push(result.rows[0])
        }
      } catch (error) {
        console.error(`Error adding image ${imageIds[i]}:`, error)
      }
    }

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'edit', 'sub_album', ${id}, ${JSON.stringify({ added_images: imageIds.length })})
    `

    return NextResponse.json({ added: results.length, results }, { status: 201 })
  } catch (error) {
    console.error("Error adding images to album:", error)
    return NextResponse.json(
      { error: "Failed to add images" },
      { status: 500 }
    )
  }
}

// DELETE /api/subalbums/:id/images/:imageId - Remove image from album
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { imageId, userId } = (await request.json()) as {
      imageId: string
      userId: string
    }

    if (!userId || !imageId) {
      return NextResponse.json(
        { error: "userId and imageId are required" },
        { status: 400 }
      )
    }

    // Check ownership
    const albumCheck = await sql`
      SELECT user_id FROM sub_albums WHERE id = ${id}
    `

    if (albumCheck.rowCount === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    const album = albumCheck.rows[0] as Record<string, unknown>
    if (album.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete the link
    await sql`
      DELETE FROM sub_album_images
      WHERE sub_album_id = ${id} AND image_id = ${imageId}
    `

    // Log audit
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${userId}, 'edit', 'sub_album', ${id}, ${JSON.stringify({ removed_image: imageId })})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing image from album:", error)
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    )
  }
}
