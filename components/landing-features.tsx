"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Camera, Clock, Upload, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Camera,
    title: "Bộ sưu tập ảnh",
    description: "Lưu giữ mọi khoảnh khắc đáng nhớ trong gallery xinh đẹp",
    href: "/gallery",
  },
  {
    icon: Clock,
    title: "Dòng thời gian",
    description: "Xem lại hành trình yêu thương theo từng mốc thời gian",
    href: "/timeline",
  },
  {
    icon: Upload,
    title: "Thêm kỷ niệm",
    description: "Dễ dàng thêm ảnh và ghi chú cho những ngày đặc biệt",
    href: "/upload",
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
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
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const Icon = feature.icon

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="size-6 text-primary" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">{feature.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      <Link
        href={feature.href}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        Khám phá
        <Heart className="size-3 fill-primary transition-transform group-hover:scale-125" />
      </Link>
    </div>
  )
}

export function LandingFeatures() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-4 py-24">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
          Hành trình của chúng ta
        </h2>
        <p className="mt-3 text-muted-foreground">
          Mỗi khoảnh khắc đều đáng được trân trọng
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </section>
  )
}
