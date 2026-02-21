"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Calendar, Upload } from "lucide-react"
import { Header } from "@/components/header"
import { FloatingHearts } from "@/components/floating-hearts"
import { MusicToggle } from "@/components/music-toggle"
import { SubAlbumTimeline } from "@/components/sub-album-timeline"
import { Button } from "@/components/ui/button"
import { buildTimeline, type TimelineGroup } from "@/lib/data"
import { cn } from "@/lib/utils"
import { usePhotos } from "@/hooks/use-photos"

function TimelineCard({
  event,
  index,
  isLeft,
}: {
  event: TimelineGroup["events"][0]
  index: number
  isLeft: boolean
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
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full transition-all duration-700",
        "flex-col md:flex-row",
        isLeft ? "md:flex-row" : "md:flex-row-reverse",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className={cn(
          "w-full md:w-[calc(50%-2rem)]",
          isLeft ? "md:pr-0" : "md:pl-0"
        )}
      >
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="absolute right-3 bottom-3 left-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                <Calendar className="size-3" />
                {event.date}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {event.title}
            </h3>
            {event.note && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {event.note}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Center line marker - desktop only */}
      <div className="absolute left-1/2 top-6 z-10 hidden -translate-x-1/2 md:flex">
        <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary bg-card shadow-sm">
          <Heart className="size-4 fill-primary text-primary" />
        </div>
      </div>

      {/* Mobile marker */}
      <div className="absolute -left-[23px] top-6 z-10 md:hidden">
        <div className="flex size-8 items-center justify-center rounded-full border-2 border-primary bg-card shadow-sm">
          <Heart className="size-3 fill-primary text-primary" />
        </div>
      </div>

      <div className="hidden w-[calc(50%-2rem)] md:block" />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-px" />
      <div className="flex flex-col gap-10 pl-8 md:pl-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex w-full flex-col md:flex-row">
            <div className="w-full md:w-[calc(50%-2rem)]">
              <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[16/9] w-full bg-muted" />
                <div className="p-5">
                  <div className="mb-2 h-5 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyTimeline() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/5">
        <Calendar className="size-10 text-primary/40" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
        Chưa có sự kiện nào
      </h3>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground">
        Hãy thêm những bức ảnh đầu tiên để bắt đầu dòng thời gian của bạn
      </p>
      <Button asChild className="rounded-full">
        <Link href="/upload">
          <Upload className="mr-2 size-4" />
          Thêm kỷ niệm
        </Link>
      </Button>
    </div>
  )
}

export default function TimelinePage() {
  const { photos, isLoading } = usePhotos()
  const [viewMode, setViewMode] = useState<"albums" | "photos">("albums")

  const timelineData = useMemo(() => buildTimeline(photos), [photos])
  const years = useMemo(() => timelineData.map((g) => g.year), [timelineData])
  const [selectedYear, setSelectedYear] = useState<number | "all">("all")

  const filteredGroups = useMemo(() => {
    if (selectedYear === "all") return timelineData
    return timelineData.filter((g) => g.year === selectedYear)
  }, [selectedYear, timelineData])

  let globalIndex = 0

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingHearts count={6} />
      <Header />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Dòng thời gian
          </h1>
          <p className="mt-2 text-muted-foreground">
            Hành trình yêu thương của chúng ta
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <Button
            onClick={() => setViewMode("albums")}
            variant={viewMode === "albums" ? "default" : "outline"}
          >
            Album
          </Button>
          <Button
            onClick={() => setViewMode("photos")}
            variant={viewMode === "photos" ? "default" : "outline"}
          >
            Ảnh
          </Button>
        </div>

        {/* Albums View */}
        {viewMode === "albums" && (
          <SubAlbumTimeline userId="user-default" />
        )}

        {/* Photos View */}
        {viewMode === "photos" && (
          <>
            {/* Year filter */}
            {!isLoading && years.length > 0 && (
              <div className="sticky top-16 z-30 mb-12 flex items-center justify-center gap-2 bg-background/80 py-3 backdrop-blur-sm">
                <Button
                  variant={selectedYear === "all" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedYear("all")}
                >
                  Tất cả
                </Button>
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : timelineData.length === 0 ? (
              <EmptyTimeline />
            ) : (
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-px" />

                {filteredGroups.map((group) => (
                  <div key={group.year} className="relative mb-16 pl-8 md:pl-0">
                    <div className="mb-8 flex justify-center">
                      <span className="relative z-10 rounded-full bg-primary px-6 py-2 font-serif text-lg font-bold text-primary-foreground shadow-md">
                        {group.year}
                      </span>
                    </div>
                    <div className="flex flex-col gap-10">
                      {group.events.map((event, idx) => {
                        const currentGlobalIndex = globalIndex++
                        return (
                          <TimelineCard
                            key={`${event.date}-${idx}`}
                            event={event}
                            index={idx}
                            isLeft={currentGlobalIndex % 2 === 0}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex justify-center">
                  <div className="relative z-10 flex size-14 items-center justify-center rounded-full border-2 border-primary bg-card shadow-md">
                    <Heart className="size-6 animate-pulse fill-primary text-primary" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <MusicToggle />
    </div>
  )
}
