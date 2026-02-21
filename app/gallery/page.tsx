"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Play,
  Pause,
  Upload,
  ImageIcon,
} from "lucide-react"
import { Header } from "@/components/header"
import { FloatingHearts } from "@/components/floating-hearts"
import { MusicToggle } from "@/components/music-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type Memory } from "@/lib/data"
import { cn } from "@/lib/utils"
import { usePhotos } from "@/hooks/use-photos"

type FilterType = "all" | "favorite" | string

function GalleryCard({
  memory,
  index,
  onOpen,
}: {
  memory: Memory
  index: number
  onOpen: (memory: Memory) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const heights = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-[4/3]",
  ]
  const heightClass = heights[index % heights.length]

  return (
    <div
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-primary/10",
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-6 scale-95 opacity-0"
      )}
      style={{ transitionDelay: `${Math.min(index * 80, 600)}ms` }}
      onClick={() => onOpen(memory)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(memory)}
      aria-label={`Xem ${memory.caption}`}
    >
      <div className={cn("relative w-full overflow-hidden", heightClass)}>
        <Image
          src={memory.src}
          alt={memory.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute right-2 bottom-0 left-2 translate-y-4 pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs font-medium text-card">{memory.date}</p>
          <p className="text-sm font-semibold text-card">{memory.caption}</p>
        </div>
        {memory.isFavorite && (
          <div className="absolute top-2 right-2">
            <Heart className="size-5 fill-primary text-primary drop-shadow-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

function GalleryModal({
  memory,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  memory: Memory
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
      if (e.key === "ArrowRight" && hasNext) onNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-in fade-in absolute inset-0 bg-foreground/80 backdrop-blur-md duration-200"
        onClick={onClose}
      />
      <div className="animate-in fade-in zoom-in-95 relative z-10 mx-4 flex max-h-[90vh] w-full max-w-4xl flex-col items-center gap-4 duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 size-10 rounded-full bg-card/20 text-card backdrop-blur-sm hover:bg-card/40"
          aria-label="Dong"
        >
          <X className="size-5" />
        </Button>
        <div className="relative w-full overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={memory.src}
              alt={memory.alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        </div>
        <div className="glass w-full rounded-2xl p-4 text-center">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {memory.caption}
          </h3>
          <div className="mt-1 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" /> {memory.date}
            </span>
            {memory.isFavorite && (
              <span className="flex items-center gap-1 text-primary">
                <Heart className="size-3.5 fill-primary" /> Yeu thich
              </span>
            )}
          </div>
          {memory.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={!hasPrev}
            className="size-10 rounded-full bg-card/20 text-card backdrop-blur-sm hover:bg-card/40 disabled:opacity-30"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!hasNext}
            className="size-10 rounded-full bg-card/20 text-card backdrop-blur-sm hover:bg-card/40 disabled:opacity-30"
            aria-label="Ảnh tiếp"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyGallery() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/5">
        <ImageIcon className="size-10 text-primary/40" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
        Chưa có kỷ niệm nào
      </h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground">
        Hãy bắt đầu lưu giữ những khoảnh khắc đẹp của hai bạn
      </p>
      <Button asChild className="rounded-full">
        <Link href="/upload">
          <Upload className="mr-2 size-4" />
          Thêm ảnh đầu tiên
        </Link>
      </Button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="mb-4 break-inside-avoid">
          <div
            className={cn(
              "animate-pulse rounded-2xl bg-muted",
              i % 3 === 0
                ? "aspect-[3/4]"
                : i % 3 === 1
                  ? "aspect-square"
                  : "aspect-[4/3]"
            )}
          />
        </div>
      ))}
    </div>
  )
}

export default function GalleryPage() {
  const { photos, isLoading } = usePhotos()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [slideshow, setSlideshow] = useState(false)
  const slideshowRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const years = useMemo(
    () => [...new Set(photos.map((m) => m.year))].sort(),
    [photos]
  )

  const filtered = useMemo(() => {
    return photos.filter((m) => {
      const matchesSearch =
        search === "" ||
        m.caption.toLowerCase().includes(search.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      const matchesFilter =
        filter === "all" ||
        (filter === "favorite" && m.isFavorite) ||
        m.year.toString() === filter
      return matchesSearch && matchesFilter
    })
  }, [photos, search, filter])

  const selectedIndex = selectedMemory
    ? filtered.findIndex((m) => m.id === selectedMemory.id)
    : -1

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) setSelectedMemory(filtered[selectedIndex - 1])
  }, [selectedIndex, filtered])

  const handleNext = useCallback(() => {
    if (selectedIndex < filtered.length - 1)
      setSelectedMemory(filtered[selectedIndex + 1])
  }, [selectedIndex, filtered])

  useEffect(() => {
    if (slideshow && selectedMemory) {
      slideshowRef.current = setInterval(() => {
        setSelectedMemory((prev) => {
          if (!prev) return null
          const idx = filtered.findIndex((m) => m.id === prev.id)
          return idx < filtered.length - 1 ? filtered[idx + 1] : filtered[0]
        })
      }, 3000)
    }
    return () => {
      if (slideshowRef.current) clearInterval(slideshowRef.current)
    }
  }, [slideshow, selectedMemory, filtered])

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingHearts count={6} />
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Kỷ niệm
          </h1>
          <p className="mt-2 text-muted-foreground">
            Những khoảnh khắc đáng nhớ của chúng ta
          </p>
        </div>

        {/* Filters */}
        {!isLoading && photos.length > 0 && (
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm kỷ niệm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full border-border bg-card pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(
                ["all", "favorite", ...years.map(String)] as FilterType[]
              ).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? (
                    "Tất cả"
                  ) : f === "favorite" ? (
                    <span className="flex items-center gap-1">
                      <Star className="size-3" /> Yêu thích
                    </span>
                  ) : (
                    f
                  )}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => {
                  if (!slideshow && filtered.length > 0) {
                    setSelectedMemory(filtered[0])
                  }
                  setSlideshow(!slideshow)
                }}
              >
                {slideshow ? (
                  <Pause className="mr-1 size-3" />
                ) : (
                  <Play className="mr-1 size-3" />
                )}
                {slideshow ? "Dừng" : "Trình chiếu"}
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : photos.length === 0 ? (
          <EmptyGallery />
        ) : filtered.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {filtered.map((memory, index) => (
              <div key={memory.id} className="mb-4 break-inside-avoid">
                <GalleryCard
                  memory={memory}
                  index={index}
                  onOpen={setSelectedMemory}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="mb-4 size-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              Không tìm thấy kỷ niệm nào
            </p>
            <p className="text-sm text-muted-foreground/70">
              Thử tìm kiếm với những từ khoá khác
            </p>
          </div>
        )}
      </main>

      {selectedMemory && (
        <GalleryModal
          memory={selectedMemory}
          onClose={() => {
            setSelectedMemory(null)
            setSlideshow(false)
          }}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filtered.length - 1}
        />
      )}

      <MusicToggle />
    </div>
  )
}
