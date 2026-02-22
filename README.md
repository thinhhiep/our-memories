# 📸 Our Memories - Photo Timeline & Album Gallery

A beautiful Next.js application for organizing and sharing your memories through interactive timelines and nested albums.

## 🌟 Features

- **📅 Interactive Timeline**: Visual timeline of memories organized by year and month
- **📁 Sub-Albums**: Create albums within albums for better organization
- **🖼️ Image Management**: Upload, organize, and manage photos with metadata (captions, dates, tags)
- **🔐 Privacy Controls**: Share albums with custom tokens, passwords, and expiration dates
- **🎵 Background Music**: Optional background music support
- **💫 Smooth Animations**: Beautiful animations and transitions throughout the app
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with Edge Runtime
- **Database**: PostgreSQL via Neon
- **ORM/Query**: @vercel/postgres (SQL)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks + SWR

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Neon PostgreSQL database account
- Environment variables configured

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your database credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
POSTGRES_URL=postgresql://user:password@host/database?sslmode=require
```

You can get these values from your [Neon dashboard](https://console.neon.tech/).

### 3. Initialize Database

Run the database initialization script to create tables and indexes:

```bash
npm run init-db
```

This will create the following tables:
- `sub_albums` - Album metadata
- `images` - Image metadata
- `sub_album_images` - Junction table linking albums to images
- `share_tokens` - Public sharing tokens
- `audit_logs` - Activity tracking

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── api/
│   ├── subalbums/          # Album CRUD endpoints
│   ├── images/             # Image management endpoints
│   └── photos/             # Photo listing endpoint
├── gallery/                # Gallery view page
├── timeline/               # Timeline view page
└── upload/                 # Upload page

components/
├── ui/                     # Shadcn/ui components
├── sub-album-card.tsx      # Album card display
├── sub-album-modal.tsx     # Album details modal
├── sub-album-timeline.tsx  # Timeline component
└── ...                     # Other components

lib/
├── db-setup.ts             # Database schema
├── subalbum-types.ts       # TypeScript types
└── utils.ts                # Utility functions

hooks/
├── use-photos.ts           # Photo fetching hook
├── use-subalbums.ts        # Album fetching hook
└── ...                     # Other hooks

scripts/
└── init-db.ts              # Database initialization script
```

## 🔌 API Endpoints

### Albums
- `GET /api/subalbums` - List all albums
- `POST /api/subalbums` - Create new album
- `GET /api/subalbums/:id` - Get album details
- `PATCH /api/subalbums/:id` - Update album
- `DELETE /api/subalbums/:id` - Delete album

### Images
- `POST /api/subalbums/:id/images` - Add images to album
- `DELETE /api/subalbums/:id/images` - Remove image from album
- `PATCH /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image

## 🔐 Security

- **Environment Variables**: Sensitive data stored in `.env.local` (added to `.gitignore`)
- **Edge Runtime**: API routes run on Vercel Edge Network for better performance
- **SQL Injection Prevention**: Using parameterized queries via @vercel/postgres
- **User Ownership**: All operations verify user ownership before allowing modifications

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database tables

## 🎨 Customization

### Colors & Styling
Tailwind CSS configuration is in `tailwind.config.ts`. Customize theme colors in `globals.css`.

### Adding Features
1. Define types in `lib/subalbum-types.ts`
2. Create API routes in `app/api/`
3. Build React components in `components/`
4. Add data fetching hooks in `hooks/`

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Neon](https://neon.tech/) for PostgreSQL hosting
- [Vercel](https://vercel.com/) for hosting and edge runtime
