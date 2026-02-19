"use client"

import { useState, useRef, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

const AUDIO_SRC = '/audio/audio.mp3';

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.src = AUDIO_SRC
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        // Browser may block autoplay
      })
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="fixed right-4 bottom-4 z-50 size-12 rounded-full bg-card/80 text-foreground shadow-lg backdrop-blur-md hover:bg-card"
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      {isPlaying ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
      {isPlaying && (
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-primary animate-pulse" />
      )}
    </Button>
  )
}
