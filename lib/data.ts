export interface Memory {
  id: string
  src: string
  alt: string
  date: string
  caption: string
  tags: string[]
  isFavorite: boolean
  year: number
  pathname?: string
}

export interface TimelineEvent {
  date: string
  title: string
  note: string
  image: string
}

export interface TimelineGroup {
  year: number
  events: TimelineEvent[]
}

// Convert memories into timeline groups, sorted by year
export function buildTimeline(memories: Memory[]): TimelineGroup[] {
  const grouped = new Map<number, TimelineEvent[]>()

  // Sort by date ascending for timeline
  const sorted = [...memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  for (const m of sorted) {
    const year = m.year
    if (!grouped.has(year)) grouped.set(year, [])

    // Format date to DD/MM/YYYY
    const [y, mo, d] = m.date.split("-")
    const formattedDate = d && mo && y ? `${d}/${mo}/${y}` : m.date

    grouped.get(year)!.push({
      date: formattedDate,
      title: m.caption || "Kỷ niệm",
      note: "",
      image: m.src,
    })
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, events]) => ({ year, events }))
}
