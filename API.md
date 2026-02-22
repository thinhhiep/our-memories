# 📡 API Documentation

Complete API reference for Our Memories application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, authentication is based on `userId` parameter. In production, this should be replaced with proper JWT or session-based authentication.

## Albums (Sub-Albums)

### List Albums

Get all albums for a user with optional filtering.

**Endpoint:** `GET /subalbums`

**Query Parameters:**
- `userId` (required) - User identifier
- `from` (optional) - Start date (YYYY-MM-DD)
- `to` (optional) - End date (YYYY-MM-DD)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Example:**
```bash
curl "http://localhost:3000/api/subalbums?userId=user-123&page=1&limit=10"
```

**Response:**
```json
{
  "albums": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "user-123",
      "title": "Summer 2024",
      "description": "Amazing summer trip",
      "start_date": "2024-06-01",
      "end_date": "2024-08-31",
      "tags": ["vacation", "beach"],
      "visibility": "private",
      "cover_image_id": "img-123",
      "imageCount": 45,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### Create Album

Create a new album.

**Endpoint:** `POST /subalbums`

**Request Body:**
```json
{
  "userId": "user-123",
  "title": "Summer 2024",
  "description": "Amazing summer trip",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "tags": ["vacation", "beach"],
  "visibility": "private"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/subalbums \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "title": "Summer 2024",
    "description": "Amazing summer trip",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "tags": ["vacation", "beach"],
    "visibility": "private"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-123",
  "title": "Summer 2024",
  "description": "Amazing summer trip",
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "tags": ["vacation", "beach"],
  "visibility": "private",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Album Details

Get a single album with all its images.

**Endpoint:** `GET /subalbums/:id`

**Example:**
```bash
curl "http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000?userId=user-123"
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-123",
  "title": "Summer 2024",
  "description": "Amazing summer trip",
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "tags": ["vacation", "beach"],
  "visibility": "private",
  "cover_image_id": "img-123",
  "images": [
    {
      "id": "img-123",
      "url": "https://example.com/image.jpg",
      "thumb_url": "https://example.com/thumb.jpg",
      "caption": "Beautiful sunset",
      "date": "2024-07-15",
      "tags": ["sunset", "beach"],
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Update Album

Update album details.

**Endpoint:** `PATCH /subalbums/:id`

**Request Body:**
```json
{
  "userId": "user-123",
  "title": "Summer 2024 - Updated",
  "description": "Updated description",
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "tags": ["vacation", "beach", "memories"],
  "visibility": "link",
  "coverImageId": "img-456"
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "title": "Summer 2024 - Updated",
    "visibility": "link"
  }'
```

**Response:** Updated album object

### Delete Album

Delete an album and all associated images.

**Endpoint:** `DELETE /subalbums/:id`

**Query Parameters:**
- `userId` (required) - For ownership verification

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000?userId=user-123"
```

**Response:**
```json
{
  "success": true,
  "message": "Album deleted successfully"
}
```

---

## Images

### Add Images to Album

Add one or more images to an album.

**Endpoint:** `POST /subalbums/:id/images`

**Request Body:**
```json
{
  "userId": "user-123",
  "images": [
    {
      "id": "img-123",
      "url": "https://example.com/image1.jpg",
      "caption": "Beautiful sunset",
      "date": "2024-07-15"
    },
    {
      "id": "img-124",
      "url": "https://example.com/image2.jpg",
      "caption": "Morning coffee",
      "date": "2024-07-16"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000/images \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "images": [
      {
        "id": "img-123",
        "url": "https://example.com/image.jpg"
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "addedCount": 2,
  "message": "Images added successfully"
}
```

### Remove Image from Album

Remove an image from an album.

**Endpoint:** `DELETE /subalbums/:id/images`

**Request Body:**
```json
{
  "userId": "user-123",
  "imageId": "img-123"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000/images \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "imageId": "img-123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Image removed from album"
}
```

### Update Image Metadata

Update image details like caption, date, and tags.

**Endpoint:** `PATCH /images/:id`

**Request Body:**
```json
{
  "userId": "user-123",
  "caption": "Updated caption",
  "date": "2024-07-20",
  "tags": ["beach", "sunset", "memories"],
  "metadata": {
    "location": "Hawaii",
    "camera": "Canon EOS"
  }
}
```

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/images/img-123 \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "caption": "Updated caption"
  }'
```

**Response:**
```json
{
  "id": "img-123",
  "url": "https://example.com/image.jpg",
  "caption": "Updated caption",
  "date": "2024-07-20",
  "tags": ["beach", "sunset", "memories"],
  "metadata": {
    "location": "Hawaii",
    "camera": "Canon EOS"
  }
}
```

### Delete Image

Delete an image completely.

**Endpoint:** `DELETE /images/:id`

**Query Parameters:**
- `userId` (required) - For ownership verification

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/images/img-123?userId=user-123"
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "error_code"
}
```

### Common Status Codes

- `400` - Bad Request (missing required parameters)
- `401` - Unauthorized (user verification failed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (database error)

### Example Error Response

```json
{
  "error": "userId is required",
  "code": "missing_parameter"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, implement rate limiting to prevent abuse:

```javascript
// Example: 100 requests per 15 minutes per IP
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## Pagination

List endpoints support pagination with `page` and `limit` parameters:

- `page` (optional, default: 1) - Page number starting from 1
- `limit` (optional, default: 20) - Items per page (max: 100)

Response includes pagination metadata:
```json
{
  "albums": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

## Testing

### Using cURL

```bash
# List albums
curl "http://localhost:3000/api/subalbums?userId=user-123"

# Create album
curl -X POST http://localhost:3000/api/subalbums \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","title":"Test Album"}'

# Get album details
curl "http://localhost:3000/api/subalbums/550e8400-e29b-41d4-a716-446655440000?userId=user-123"
```

### Using Postman

1. Import the API endpoints
2. Set `userId` variable: `user-123`
3. Test each endpoint

### Using JavaScript/Fetch

```javascript
// List albums
const response = await fetch('/api/subalbums?userId=user-123');
const data = await response.json();
console.log(data);

// Create album
const response = await fetch('/api/subalbums', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-123',
    title: 'My Album'
  })
});
const data = await response.json();
console.log(data);
```

---

## Future Enhancements

- [ ] JWT Authentication
- [ ] Rate Limiting
- [ ] Webhook Support
- [ ] Batch Operations
- [ ] Advanced Filtering
- [ ] Full-text Search
- [ ] Image Processing (resize, compress)
- [ ] S3/Cloud Storage Integration
