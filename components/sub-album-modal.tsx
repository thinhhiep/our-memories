"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Star, Trash2, Check } from "lucide-react"
import { SubAlbum } from "@/lib/subalbum-types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubAlbumModalProps {
  album: SubAlbum | null
  isOpen: boolean
  onClose: () => void
  onSetCover?: (imageId: string) => Promise<void>
  onDeleteImage?: (imageId: string) => Promise<void>
  isLoading?: boolean
}

export function SubAlbumModal({
  album,
  isOpen,
  onClose,
  onSetCover,
  onDeleteImage,
  isLoading = false,
}: SubAlbumModalProps) {
  const [selectedForCover, setSelectedForCover] = useState<string | null>(null)

  if (!isOpen || !album) return null

  const handleSetCover = async (imageId: string) => {
    if (onSetCover) {
      try {
        await onSetCover(imageId)
        setSelectedForCover(imageId)
      } catch (error) {
        console.error("Failed to set cover:", error)
      }
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (onDeleteImage) {
      try {
        await onDeleteImage(imageId)
      } catch (error) {
        console.error("Failed to delete image:", error)
      }
    }
  }

  const images = (album?.images || []) as Array<{
    id: string
    url: string
    thumb_url?: string
    caption?: string
  }>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="animate-in fade-in absolute inset-0 bg-foreground/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 mx-4 h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold">{album.title}</h2>
            {album.description && (
              <p className="mt-2 text-muted-foreground">{album.description}</p>
            )}
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              {album.start_date && <span>📅 {album.start_date}</span>}
              {album.image_count !== undefined && <span>📸 {album.image_count} ảnh</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Tags */}
        {album.tags && album.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {album.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Images Grid */}
        {images.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={image.thumb_url || image.url}
                    alt={image.caption || "Album photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => handleSetCover(image.id)}
                    disabled={isLoading}
                    className={cn(
                      "rounded-lg p-2 transition-colors",
                      selectedForCover === image.id || album.cover_image_id === image.id
                        ? "bg-primary text-white"
                        : "bg-white/20 text-white hover:bg-white/40"
                    )}
                    title="Set as cover"
                  >
                    {selectedForCover === image.id || album.cover_image_id === image.id ? (
                      <Check className="size-4" />
                    ) : (
                      <Star className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={isLoading}
                    className="rounded-lg bg-destructive/80 p-2 text-white transition-colors hover:bg-destructive"
                    title="Remove from album"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs text-white line-clamp-2">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
            <p className="text-center text-muted-foreground">
              No images in this album yet
            </p>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
