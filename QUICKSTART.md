# 🎯 Quick Start Guide

Welcome to **Our Memories** - A beautiful photo timeline and album management app!

## 📦 What You Get

This project includes:
- ✅ **PostgreSQL Database** - Neon with 5 optimized tables
- ✅ **8 API Endpoints** - Full CRUD for albums and images
- ✅ **5 React Components** - SubAlbum cards, modals, timeline
- ✅ **Complete Documentation** - 10 markdown files with guides
- ✅ **Deployment Ready** - Works on Vercel, Railway, Heroku

## 🚀 Get Running in 5 Minutes

### 1. Clone and Install
```bash
git clone https://github.com/thinhhiep/our-memories.git
cd our-memories
npm install
```

### 2. Setup Database
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your Neon credentials
# Visit https://console.neon.tech to get DATABASE_URL

# Initialize tables
npm run init-db
```

### 3. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` and start using the app!

---

## 📚 Documentation Guide

| File | What's Inside |
|------|---------------|
| **[README.md](README.md)** | Project overview, features, tech stack |
| **[SETUP.md](SETUP.md)** | Step-by-step database setup |
| **[API.md](API.md)** | All API endpoints with examples |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to Vercel, Heroku, Railway |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | How to contribute code |
| **[ROADMAP.md](ROADMAP.md)** | Planned features for v0.2.0+ |
| **[SECURITY.md](SECURITY.md)** | Security practices and policies |
| **[FAQ.md](FAQ.md)** | Common questions answered |
| **[PROJECT_STATUS.md](PROJECT_STATUS.md)** | Current status and progress |
| **[CHANGELOG.md](CHANGELOG.md)** | What's new in each version |

## 💡 Key Features

- 📅 **Interactive Timeline** - Browse memories by year/month
- 📁 **Nested Albums** - Organize photos into albums
- 🖼️ **Image Management** - Upload, organize, annotate
- 🔐 **Privacy Controls** - Share with tokens (coming soon)
- 💫 **Beautiful UI** - Smooth animations and responsive design

## 🛠️ Available Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Check code quality
npm run init-db     # Initialize database tables
```

## 📊 Project Structure

```
app/api/            # API endpoints (CRUD operations)
components/         # React components (UI elements)
hooks/              # Custom React hooks (data fetching)
lib/                # Utilities and types
public/             # Static files
scripts/            # Database initialization
styles/             # CSS files
```

## 🔐 Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...  # From Neon dashboard
POSTGRES_URL=postgresql://...  # Same as above
```

## 🌐 API Quick Examples

### Create an Album
```bash
curl -X POST http://localhost:3000/api/subalbums \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "title": "Summer Trip",
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "visibility": "private"
  }'
```

### List Albums
```bash
curl "http://localhost:3000/api/subalbums?userId=user-123"
```

### Add Photos to Album
```bash
curl -X POST http://localhost:3000/api/subalbums/{albumId}/images \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "images": [
      {
        "id": "img-1",
        "url": "https://example.com/photo.jpg"
      }
    ]
  }'
```

See [API.md](API.md) for complete endpoint documentation.

## 🚀 Next Steps

### Immediate (Today)
1. ✅ Clone and setup project
2. ✅ Initialize database
3. ✅ Run development server
4. ✅ Test basic functionality

### Short-term (This Week)
- Test all API endpoints
- Create test albums and photos
- Review code and documentation
- Set up deployment environment

### Medium-term (Next 2 Weeks)
- Deploy to Vercel/Heroku/Railway
- Implement sharing features
- Add upload improvements
- Optimize performance

### Long-term (Next Month+)
- Search functionality
- Collaboration features
- Mobile app (PWA)
- AI-powered features

See [ROADMAP.md](ROADMAP.md) for detailed feature roadmap.

## 🤔 Questions?

1. **Setup problems?** → See [SETUP.md](SETUP.md)
2. **API questions?** → See [API.md](API.md)
3. **Deployment help?** → See [DEPLOYMENT.md](DEPLOYMENT.md)
4. **General questions?** → See [FAQ.md](FAQ.md)
5. **Still stuck?** → Create GitHub issue

## 📱 Features Coming Soon

- 🔐 Public sharing with links
- 🔒 Password-protected albums
- 📤 Drag-drop upload
- 🔍 Search and filtering
- 💬 Comments and likes
- 📊 Analytics dashboard
- 📱 Mobile app

See [ROADMAP.md](ROADMAP.md) for complete list.

## 🔒 Security Notes

- All data encrypted with SSL/TLS
- Environment variables keep secrets safe
- SQL injection prevention implemented
- User ownership verification
- Secure by default

See [SECURITY.md](SECURITY.md) for details.

## 📦 Tech Stack

- **Framework**: Next.js 14+
- **Database**: PostgreSQL (Neon)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Icons**: Lucide React

## 🤝 Contributing

Want to help?
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Check [ROADMAP.md](ROADMAP.md) for planned features
3. Create a fork and submit PR

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 You're All Set!

1. **Database**: ✅ Configured
2. **API**: ✅ Ready
3. **Frontend**: ✅ Built
4. **Docs**: ✅ Complete

**Now go create some memories!** 📸

---

**Questions?** Check [FAQ.md](FAQ.md) or create a GitHub issue.

**Have ideas?** Check [ROADMAP.md](ROADMAP.md) or create a discussion.

**Ready to deploy?** Follow [DEPLOYMENT.md](DEPLOYMENT.md).

Happy coding! 🚀
