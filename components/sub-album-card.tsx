"use client"

import Image from "next/image"
import { Heart, Calendar, ImageIcon } from "lucide-react"
import { SubAlbum } from "@/lib/subalbum-types"
import { cn } from "@/lib/utils"

interface SubAlbumCardProps {
  album: SubAlbum
  onClick?: () => void
}

export function SubAlbumCard({ album, onClick }: SubAlbumCardProps) {
  const dateRange = album.start_date && album.end_date ? `${album.start_date} → ${album.end_date}` : album.start_date || "No date"

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
      )}
      aria-label={`Album: ${album.title}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-square w-full bg-muted">
        {album.cover_image ? (
          <Image
            src={album.cover_image.thumb_url || album.cover_image.url}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <ImageIcon className="size-12 text-muted-foreground" />
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Info Section */}
      <div className="absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-100 transition-all duration-300 group-hover:translate-y-0">
        <h3 className="font-serif text-sm font-semibold text-white line-clamp-2">{album.title}</h3>

        <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/80">
          {album.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" /> {dateRange}
            </span>
          )}
          {album.image_count !== undefined && (
            <span className="flex items-center gap-1">
              <ImageIcon className="size-3" /> {album.image_count} ảnh
            </span>
          )}
        </div>

        {album.description && (
          <p className="mt-2 text-xs text-white/70 line-clamp-2">{album.description}</p>
        )}
      </div>
    </div>
  )
}
