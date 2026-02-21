/**
 * SubAlbum Model and Types
 */

export interface Image {
  id: string
  user_id: string
  url: string
  thumb_url?: string
  caption?: string
  date?: string
  tags: string[]
  metadata?: Record<string, unknown>
  uploaded_at: string
}

export interface SubAlbum {
  id: string
  user_id: string
  title: string
  description?: string
  start_date?: string // YYYY-MM-DD
  end_date?: string // YYYY-MM-DD
  tags: string[]
  visibility: "private" | "link" | "public"
  cover_image_id?: string
  cover_image?: Image
  images?: Image[]
  created_at: string
  updated_at: string
  created_by: string
  image_count?: number
}

export interface SubAlbumImage {
  id: string
  sub_album_id: string
  image_id: string
  position?: number
  added_by: string
  added_at: string
}

export interface ShareToken {
  id: string
  sub_album_id: string
  token: string
  password_hash?: string
  expires_at?: string
  created_by: string
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: "create" | "edit" | "delete" | "share" | "view"
  resource_type: "sub_album" | "image" | "share"
  resource_id?: string
  details?: Record<string, unknown>
  created_at: string
}

// API Request/Response Types
export interface CreateSubAlbumRequest {
  title: string
  description?: string
  start_date?: string
  end_date?: string
  tags?: string[]
  visibility?: "private" | "link" | "public"
}

export interface UpdateSubAlbumRequest {
  title?: string
  description?: string
  start_date?: string
  end_date?: string
  tags?: string[]
  visibility?: "private" | "link" | "public"
  cover_image_id?: string
}

export interface TimelineGroup {
  year: number
  months: TimelineMonth[]
}

export interface TimelineMonth {
  month: number
  subAlbums: SubAlbum[]
}
