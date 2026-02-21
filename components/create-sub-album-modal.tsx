"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateSubAlbumRequest } from "@/lib/subalbum-types"
import { cn } from "@/lib/utils"

interface CreateSubAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateSubAlbumRequest) => Promise<void>
  isLoading?: boolean
}

export function CreateSubAlbumModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateSubAlbumModalProps) {
  const [formData, setFormData] = useState<CreateSubAlbumRequest>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    tags: [],
    visibility: "private",
  })
  const [error, setError] = useState<string>("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setFormData((prev) => ({
      ...prev,
      tags,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Album title is required")
      return
    }

    try {
      await onSubmit(formData)
      setFormData({
        title: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        tags: [],
        visibility: "private",
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create album")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="animate-in fade-in absolute inset-0 bg-foreground/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-lg rounded-2xl bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold">Create Album</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Album Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Summer Trip 2024"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add a description..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {/* Date Range */}
          <div className="grid gap-3 grid-cols-2">
            <div>
              <label htmlFor="start_date" className="mb-2 block text-sm font-medium">
                Start Date
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="end_date" className="mb-2 block text-sm font-medium">
                End Date
              </label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="mb-2 block text-sm font-medium">
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags?.join(", ") || ""}
              onChange={handleTagsChange}
              placeholder="e.g., trip, summer, beach"
            />
          </div>

          {/* Visibility */}
          <div>
            <label htmlFor="visibility" className="mb-2 block text-sm font-medium">
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="private">Private (Only you)</option>
              <option value="link">Link (Share with link)</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Error */}
          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Album"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
