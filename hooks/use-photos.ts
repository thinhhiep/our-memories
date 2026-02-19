import useSWR from "swr"
import type { Memory } from "@/lib/data"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function usePhotos() {
  const { data, error, isLoading, mutate } = useSWR<{ photos: Memory[] }>(
    "/api/photos",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    photos: data?.photos ?? [],
    isLoading,
    isError: !!error,
    mutate,
  }
}
