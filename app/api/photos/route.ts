import { put, list, del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// GET - list all photos from Blob store
export async function GET() {
  try {
    const { blobs } = await list({ prefix: "photos/" })

    const photos = blobs.map((blob) => {
      // Parse metadata from pathname: photos/{id}__{date}__{caption}__{tags}__{isFavorite}.ext
      const filename = blob.pathname.replace("photos/", "")
      const parts = filename.split("__")
      const id = parts[0] || blob.pathname
      const date = parts[1] ? decodeURIComponent(parts[1]) : new Date(blob.uploadedAt).toISOString().split("T")[0]
      const caption = parts[2] ? decodeURIComponent(parts[2]) : ""
      const tagsStr = parts[3] ? decodeURIComponent(parts[3]) : ""
      const isFavorite = parts[4]?.startsWith("fav") || false

      return {
        id,
        src: blob.url,
        alt: caption || "Memory photo",
        date,
        caption,
        tags: tagsStr ? tagsStr.split(",").filter(Boolean) : [],
        isFavorite,
        year: parseInt(date.split("-")[0]) || new Date().getFullYear(),
        uploadedAt: blob.uploadedAt,
        pathname: blob.pathname,
      }
    })

    // Sort by date descending (newest first)
    photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ photos })
  } catch (error) {
    console.error("Error listing photos:", error)
    return NextResponse.json({ photos: [], error: "Failed to list photos" }, { status: 500 })
  }
}

// POST - upload a new photo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caption = (formData.get("caption") as string) || ""
    const tags = (formData.get("tags") as string) || ""
    const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0]

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Generate unique ID
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Encode metadata in pathname for retrieval
    const ext = file.name.split(".").pop() || "jpg"
    const encodedCaption = encodeURIComponent(caption)
    const encodedDate = encodeURIComponent(date)
    const encodedTags = encodeURIComponent(tags)
    const pathname = `photos/${id}__${encodedDate}__${encodedCaption}__${encodedTags}__.${ext}`

    const blob = await put(pathname, file, {
      access: "public",
    })

    return NextResponse.json({
      id,
      src: blob.url,
      alt: caption || "Memory photo",
      date,
      caption,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      isFavorite: false,
      year: parseInt(date.split("-")[0]) || new Date().getFullYear(),
      pathname: blob.pathname,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

// DELETE - delete a photo
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
