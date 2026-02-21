"use client"

import { useState, useRef, useEffect } from "react"
import { SubAlbumCard } from "@/components/sub-album-card"
import { SubAlbumModal } from "@/components/sub-album-modal"
import { CreateSubAlbumModal } from "@/components/create-sub-album-modal"
import { useSubAlbums, buildTimelineGroups } from "@/hooks/use-subalbums"
import { SubAlbum, CreateSubAlbumRequest, TimelineGroup } from "@/lib/subalbum-types"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubAlbumTimelineProps {
  userId: string
}

export function SubAlbumTimeline({ userId }: SubAlbumTimelineProps) {
  const { subAlbums, isLoading, isError, mutate } = useSubAlbums(userId)
  const [selectedAlbum, setSelectedAlbum] = useState<SubAlbum | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())

  const timelineGroups = buildTimelineGroups(subAlbums)

  const toggleYearExpanded = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })
  }

  const handleCreateAlbum = async (data: CreateSubAlbumRequest) => {
    try {
      const res = await fetch("/api/subalbums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      })

      if (!res.ok) throw new Error("Failed to create album")

      await mutate()
      setIsCreateOpen(false)
    } catch (error) {
      console.error("Error creating album:", error)
      throw error
    }
  }

  const handleSetCover = async (imageId: string) => {
    if (!selectedAlbum) return

    try {
      const res = await fetch(`/api/subalbums/${selectedAlbum.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cover_image_id: imageId }),
      })

      if (!res.ok) throw new Error("Failed to set cover")

      const updated = await res.json()
      setSelectedAlbum(updated)
      await mutate()
    } catch (error) {
      console.error("Error setting cover:", error)
      throw error
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedAlbum) return

    try {
      const res = await fetch(`/api/subalbums/${selectedAlbum.id}/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, userId }),
      })

      if (!res.ok) throw new Error("Failed to delete image")

      await mutate()
      // Refetch album details
      const albumRes = await fetch(`/api/subalbums/${selectedAlbum.id}`)
      const updated = await albumRes.json()
      setSelectedAlbum(updated)
    } catch (error) {
      console.error("Error deleting image:", error)
      throw error
    }
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load albums</p>
      </div>
    )
  }

  return (
    <>
      {/* Create Button */}
      <div className="mb-6 flex justify-center">
        <Button
          onClick={() => setIsCreateOpen(true)}
          disabled={isLoading}
          className="gap-2"
        >
          <Plus className="size-4" />
          Create Album
        </Button>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading albums...</p>
        </div>
      ) : subAlbums.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
          <div className="text-center">
            <p className="text-muted-foreground">No albums yet</p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              className="mt-4"
            >
              Create your first album
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {timelineGroups.map((group: TimelineGroup) => (
            <div key={group.year} className="space-y-4">
              {/* Year Header */}
              <button
                onClick={() => toggleYearExpanded(group.year)}
                className="sticky top-0 z-20 flex w-full items-center gap-2 rounded-lg bg-background/95 py-2 px-4 text-lg font-bold text-foreground backdrop-blur transition-all hover:bg-background"
              >
                <ChevronDown
                  className={cn(
                    "size-5 transition-transform",
                    expandedYears.has(group.year) ? "rotate-180" : ""
                  )}
                />
                {group.year}
              </button>

              {/* Months & Albums */}
              {expandedYears.has(group.year) && (
                <div className="space-y-6 pl-6">
                  {group.months.map((month) => {
                    const monthName = new Date(2024, month.month - 1).toLocaleString(
                      "en-US",
                      { month: "long" }
                    )

                    return (
                      <div key={month.month} className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          {monthName}
                        </h3>

                        {/* Albums Grid */}
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {month.subAlbums.map((album) => (
                            <div
                              key={album.id}
                              onClick={() => {
                                setSelectedAlbum(album)
                                setIsModalOpen(true)
                              }}
                            >
                              <SubAlbumCard album={album} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <SubAlbumModal
        album={selectedAlbum}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAlbum(null)
        }}
        onSetCover={handleSetCover}
        onDeleteImage={handleDeleteImage}
      />

      <CreateSubAlbumModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateAlbum}
      />
    </>
  )
}
