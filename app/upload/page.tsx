"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Lock,
  Upload,
  ImagePlus,
  X,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
  ImageIcon,
} from "lucide-react"
import { Header } from "@/components/header"
import { FloatingHearts } from "@/components/floating-hearts"
import { MusicToggle } from "@/components/music-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { usePhotos } from "@/hooks/use-photos"

interface FilePreview {
  id: string
  file: File
  preview: string
  caption: string
  tags: string
  date: string
}

// Password gate
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "yeuem" || password === "love") {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div
        className={cn(
          "glass w-full max-w-sm rounded-2xl p-8 text-center transition-transform",
          shake && "animate-[shake_0.5s_ease-in-out]"
        )}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-7 text-primary" />
          </div>
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">
          Khu vực riêng tư
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Nhập mật khẩu để truy cập khu vực upload
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className={cn(
              "rounded-xl bg-card text-center",
              error && "border-destructive"
            )}
            autoFocus
          />
          {error && (
            <p className="text-xs text-destructive">
              Mật khẩu không đúng. Thử lại nhé!
            </p>
          )}
          <Button type="submit" className="rounded-xl">
            <Heart className="mr-2 size-4" />
            Mở khóa
          </Button>
          <p className="text-xs text-muted-foreground/60">Gợi ý: yeuem</p>
        </form>
      </div>
    </div>
  )
}

// Upload area
function UploadArea() {
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate } = usePhotos()

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles: FilePreview[] = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: Math.random().toString(36).slice(2),
        file: f,
        preview: URL.createObjectURL(f),
        caption: "",
        tags: "",
        date: new Date().toISOString().split("T")[0],
      }))
    setFiles((prev) => [...prev, ...newFiles])
    setUploadComplete(false)
    setUploadError(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) URL.revokeObjectURL(file.preview)
      return prev.filter((f) => f.id !== id)
    })
  }

  const updateFile = (
    id: string,
    field: keyof FilePreview,
    value: string
  ) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const total = files.length
      let completed = 0

      for (const fileItem of files) {
        const formData = new FormData()
        formData.append("file", fileItem.file)
        formData.append("caption", fileItem.caption)
        formData.append("tags", fileItem.tags)
        formData.append("date", fileItem.date)

        const res = await fetch("/api/photos", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || `Upload failed for ${fileItem.file.name}`)
        }

        completed++
        setUploadProgress((completed / total) * 100)
      }

      // Clean up previews
      files.forEach((f) => URL.revokeObjectURL(f.preview))

      // Revalidate the photos list
      await mutate()

      setUploading(false)
      setUploadComplete(true)
    } catch (err) {
      console.error("Upload error:", err)
      setUploading(false)
      setUploadError(
        err instanceof Error ? err.message : "Tải lên thất bại. Vui lòng thử lại."
      )
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Drop zone */}
      <div
        className={cn(
          "relative mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
          isDragging
            ? "scale-[1.02] border-primary bg-primary/5"
            : "border-border bg-card/50 hover:border-primary/40 hover:bg-card"
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <ImagePlus
            className={cn(
              "size-7 text-primary transition-transform",
              isDragging && "scale-110"
            )}
          />
        </div>
        <p className="mb-1 text-base font-medium text-foreground">
          {isDragging ? "Thả ảnh vào đây" : "Kéo thả ảnh vào đây"}
        </p>
        <p className="mb-4 text-sm text-muted-foreground">hoặc</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 size-4" />
          Chọn ảnh từ thiết bị
        </Button>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
            Ảnh đã chọn ({files.length})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={file.preview}
                    alt={file.caption || "Preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 350px"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 size-7 rounded-full bg-foreground/50 text-card hover:bg-foreground/70"
                    onClick={() => removeFile(file.id)}
                    aria-label="Xoa anh"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      placeholder="Ghi chú cho ảnh..."
                      value={file.caption}
                      onChange={(e) =>
                        updateFile(file.id, "caption", e.target.value)
                      }
                      className="h-8 rounded-lg border-border bg-background text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      placeholder="Tags (vd: travel, date)"
                      value={file.tags}
                      onChange={(e) =>
                        updateFile(file.id, "tags", e.target.value)
                      }
                      className="h-8 rounded-lg border-border bg-background text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      type="date"
                      value={file.date}
                      onChange={(e) =>
                        updateFile(file.id, "date", e.target.value)
                      }
                      className="h-8 rounded-lg border-border bg-background text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload button / progress */}
      {files.length > 0 && !uploadComplete && (
        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <div className="w-full max-w-sm">
              <div className="mb-2 flex justify-center">
                <Heart className="size-8 animate-pulse text-primary" />
              </div>
              <Progress
                value={Math.min(uploadProgress, 100)}
                className="h-2.5 rounded-full"
              />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {"Đang tải lên... "}
                {Math.min(Math.round(uploadProgress), 100)}%
              </p>
            </div>
          ) : (
            <Button
              onClick={handleUpload}
              size="lg"
              className="rounded-full px-8"
            >
              <Upload className="mr-2 size-4" />
              Lưu kỷ niệm
            </Button>
          )}
        </div>
      )}

      {/* Error */}
      {uploadError && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm text-destructive">{uploadError}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 rounded-full"
            onClick={() => setUploadError(null)}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Success */}
      {uploadComplete && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-8 text-primary" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Đã lưu thành công!
          </h3>
          <p className="text-sm text-muted-foreground">
            Kỷ niệm mới đã được thêm vào bộ sưu tập
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setFiles([])
                setUploadComplete(false)
                setUploadProgress(0)
              }}
            >
              Thêm ảnh mới
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/gallery">
                <ImageIcon className="mr-2 size-4" />
                Xem bộ sưu tập
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function UploadPage() {
  const [unlocked, setUnlocked] = useState(false)

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingHearts count={6} />
      <Header />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Thêm kỷ niệm
          </h1>
          <p className="mt-2 text-muted-foreground">
            Lưu giữ thêm những khoảnh khắc đẹp
          </p>
        </div>

        {unlocked ? (
          <UploadArea />
        ) : (
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        )}
      </main>

      <MusicToggle />
    </div>
  )
}
