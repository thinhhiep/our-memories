"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, ChevronDown } from "lucide-react"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const { displayedText, isComplete } = useTypingEffect("Our Memories", 100, 800)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    }
  }, [isComplete])

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <Heart className="size-12 fill-primary text-primary animate-pulse-heart" />

        <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl text-balance">
          {displayedText}
          <span className={`ml-1 inline-block w-[3px] h-[0.8em] bg-primary align-middle ${isComplete ? "animate-typing-cursor" : ""}`} />
        </h1>

        <div
          className={`transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="mx-auto max-w-md text-lg text-muted-foreground leading-relaxed">
            Nơi lưu giữ những khoảnh khắc đẹp nhất trong hành trình yêu thương của chúng ta
          </p>
        </div>

        <div
          className={`mt-4 transition-all duration-700 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Link href="/gallery">
              <Heart className="mr-2 size-4 fill-primary-foreground" />
              Xem kỷ niệm của chúng ta
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <ChevronDown className="size-6 text-muted-foreground animate-bounce" />
      </div>
    </section>
  )
}
