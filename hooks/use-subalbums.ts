import useSWR from "swr"
import { SubAlbum, TimelineGroup } from "@/lib/subalbum-types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSubAlbums(userId: string, options?: { from?: string; to?: string }) {
  const params = new URLSearchParams({ userId })
  if (options?.from) params.append("from", options.from)
  if (options?.to) params.append("to", options.to)

  const { data, error, isLoading, mutate } = useSWR<{ subAlbums: SubAlbum[] }>(
    `/api/subalbums?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    subAlbums: data?.subAlbums ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function useSubAlbum(id: string) {
  const { data, error, isLoading, mutate } = useSWR<SubAlbum>(
    id ? `/api/subalbums/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    subAlbum: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}

export function buildTimelineGroups(subAlbums: SubAlbum[]): TimelineGroup[] {
  const grouped = new Map<number, Map<number, SubAlbum[]>>()

  // Sort by start date
  const sorted = [...subAlbums].sort(
    (a, b) => new Date(a.start_date || "").getTime() - new Date(b.start_date || "").getTime()
  )

  for (const album of sorted) {
    const year = parseInt((album.start_date || new Date().toISOString()).split("-")[0])
    const month = parseInt((album.start_date || new Date().toISOString()).split("-")[1])

    if (!grouped.has(year)) grouped.set(year, new Map())
    const monthMap = grouped.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])
    monthMap.get(month)!.push(album)
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([month, subAlbums]) => ({
          month,
          subAlbums,
        })),
    }))
}
