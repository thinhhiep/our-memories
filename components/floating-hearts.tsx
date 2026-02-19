"use client"

import { useEffect, useState } from "react"

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function FloatingHearts({ count = 12 }: { count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 10,
      duration: Math.random() * 8 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setHearts(generated)
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="animate-float-heart absolute"
          style={{
            left: `${heart.left}%`,
            width: heart.size,
            height: heart.size,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            className="text-primary"
          />
        </svg>
      ))}
    </div>
  )
}
