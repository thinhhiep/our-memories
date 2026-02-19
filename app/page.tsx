"use client"

import { FloatingHearts } from "@/components/floating-hearts"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LandingFeatures } from "@/components/landing-features"
import { MusicToggle } from "@/components/music-toggle"
import { Heart } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <FloatingHearts count={10} />
      <Header />
      <main>
        <HeroSection />
        <LandingFeatures />

        {/* Footer */}
        <footer className="relative z-10 border-t border-border py-8 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            Made with <Heart className="size-4 fill-primary text-primary animate-pulse-heart" /> for us
          </p>
        </footer>
      </main>
      <MusicToggle />
    </div>
  )
}
