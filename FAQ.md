# ❓ Frequently Asked Questions (FAQ)

## Installation & Setup

### Q: Do I need a Neon account to run this?
**A:** Yes, you need a free Neon account to use the PostgreSQL database. Go to [neon.tech](https://neon.tech/) to create one for free.

### Q: Can I use a different database?
**A:** Currently, the project is configured for PostgreSQL with Neon. You could adapt it for other databases (MySQL, SQLite) but that would require modifying the code and database schema.

### Q: How do I get the DATABASE_URL?
**A:** 
1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to "Connection string" or "SQL Editor"
4. Copy the connection string marked "Recommended for most uses"
5. Paste it in `.env.local` as `DATABASE_URL`

### Q: Can I run the project without a database?
**A:** No, the backend APIs require a database. However, you could create mock implementations for frontend-only development.

### Q: Do I need to run `npm run init-db` every time?
**A:** No, only once during setup. The script uses `CREATE TABLE IF NOT EXISTS`, so running it multiple times is safe but unnecessary.

---

## Development

### Q: How do I start development?
**A:** 
```bash
npm install
npm run init-db
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000)

### Q: Why is my database connection failing?
**A:** Check:
1. Is `.env.local` file in the project root?
2. Is `DATABASE_URL` set correctly?
3. Can you access Neon from your network?
4. Is your database running in Neon?

### Q: How do I test the API endpoints?
**A:** Use:
- **cURL**: `curl http://localhost:3000/api/subalbums?userId=test`
- **Postman**: Import endpoints from [API.md](API.md)
- **Thunder Client**: VS Code extension
- **Browser DevTools**: Network tab

### Q: Can I modify the database schema?
**A:** Yes, but:
1. Backup your data first
2. Update `scripts/init-db.ts`
3. Create a migration script
4. Test thoroughly
5. Document changes in CHANGELOG.md

### Q: How do I add a new API endpoint?
**A:** 
1. Create new file in `app/api/` folder
2. Export GET, POST, PATCH, or DELETE functions
3. Use `sql` template literals for queries
4. Add TypeScript types
5. Update `API.md` with documentation
6. Test with curl/Postman

---

## Deployment

### Q: Where should I deploy this?
**A:** Recommended hosting:
- **Vercel** (best for Next.js, free tier available)
- **Railway** (simple deployment, pay-as-you-go)
- **Heroku** (reliable, but pricing changed)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

### Q: Is it free to deploy?
**A:** 
- Vercel: Free tier includes 100GB bandwidth
- Neon: Free tier includes 3GB storage
- Railway: Free tier includes $5 monthly credit
- GitHub: Free for public repos

See [DEPLOYMENT.md](DEPLOYMENT.md) for cost details.

### Q: How do I deploy to Vercel?
**A:** 
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set environment variables
5. Click "Deploy"

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps.

### Q: How do I initialize the database in production?
**A:** After deploying, you have two options:
1. **Option A**: Deploy runs `npm run init-db` automatically (if in build script)
2. **Option B**: Run `npm run init-db` locally, then deploy

The database only needs initialization once.

### Q: Is my data secure on Neon?
**A:** Yes:
- Neon provides encryption at rest and in transit
- Regular automated backups
- SSL/TLS for connections
- You can also manual backup: `pg_dump $DATABASE_URL > backup.sql`

---

## Features & Usage

### Q: How do I create an album?
**A:** 
1. Go to `/timeline`
2. Click "Album" tab
3. Click "Create Album" button
4. Fill in title, dates, tags
5. Choose visibility (private/link/public)
6. Click "Create"

### Q: Can I add photos to an album?
**A:** Yes, via API. The UI for this is coming in v0.2.0. For now:
```bash
curl -X POST http://localhost:3000/api/subalbums/{albumId}/images \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "images": [{"id": "img-1", "url": "https://example.com/photo.jpg"}]
  }'
```

### Q: How do I share an album?
**A:** Sharing is planned for v0.2.0. Feature includes:
- Public share links
- Password protection
- Expiration dates
- View-only access

### Q: Can I edit a photo after uploading?
**A:** You can edit metadata (caption, date, tags) via API:
```bash
curl -X PATCH http://localhost:3000/api/images/{imageId} \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "caption": "New caption"
  }'
```

Image cropping/editing UI is planned for future versions.

### Q: How do I delete an album?
**A:** Via API:
```bash
curl -X DELETE "http://localhost:3000/api/subalbums/{albumId}?userId=user-123"
```

### Q: Will deleting an album delete my photos?
**A:** The album is deleted, but images remain in the database (not deleted). This is by design for data safety. If you want to delete images too:
1. Remove all images from album first
2. Then delete the album
3. Optionally delete unused images

---

## Performance

### Q: Why is my page slow?
**A:** Check:
1. Network tab - slow API responses?
2. Performance tab - JavaScript execution time?
3. Database logs - slow queries?
4. Image size - are images optimized?

### Q: How can I improve performance?
**A:** 
- Use lazy loading for images
- Optimize image sizes
- Enable browser caching
- Use pagination for large lists
- Monitor database queries

### Q: Is the app mobile-friendly?
**A:** Yes! The design is responsive for mobile. Test with Chrome DevTools mobile emulator.

---

## Security

### Q: Is my data encrypted?
**A:** 
- Connections use SSL/TLS
- Data in transit is encrypted
- Data at rest: Neon provides encryption
- Credentials stored in environment variables only

See [SECURITY.md](SECURITY.md) for details.

### Q: Can others see my albums?
**A:** 
- **Private** (default): Only you can see
- **Link**: Anyone with link can see (coming soon)
- **Public**: Listed publicly (coming soon)

Currently only private is fully implemented.

### Q: How do I report a security issue?
**A:** 
- **DO NOT** create a public issue
- Email: security@ourmemories.dev
- Include: description, steps to reproduce, impact

See [SECURITY.md](SECURITY.md) for details.

### Q: Is there user authentication?
**A:** Currently, the app uses simple `userId` parameters. Full authentication (JWT, OAuth) is planned for v0.2.0.

---

## Troubleshooting

### Q: "Cannot find module '@vercel/postgres'"
**A:** Run `npm install` to install dependencies

### Q: "Database connection failed"
**A:** Check:
- `.env.local` exists and has DATABASE_URL
- DATABASE_URL value is correct
- Neon database is running
- You can reach Neon from your network

### Q: "Port 3000 already in use"
**A:** 
```bash
# Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Q: Styles not loading
**A:** 
- Clear browser cache (Ctrl+F5)
- Rebuild: `npm run build`
- Check console for CSS errors

### Q: API returning 401 errors
**A:** Check:
- Is `userId` parameter provided?
- Is the user the owner of the resource?
- No typos in query parameters?

---

## Contributing

### Q: How do I contribute?
**A:** See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Testing requirements
- PR process
- Commit conventions

### Q: Can I add a new feature?
**A:** 
1. Check [ROADMAP.md](ROADMAP.md) for planned features
2. Create GitHub issue to discuss
3. Get approval
4. Follow [CONTRIBUTING.md](CONTRIBUTING.md)
5. Submit PR

### Q: Where do I report bugs?
**A:** Create GitHub issue with:
- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment info

Use [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)

---

## Roadmap & Future

### Q: What's coming next?
**A:** See [ROADMAP.md](ROADMAP.md). Next priorities:
- v0.2.0: Sharing & privacy features
- v0.3.0: Search & filtering
- v1.0.0: Production ready

### Q: When will feature X be available?
**A:** Check [ROADMAP.md](ROADMAP.md) for timeline. You can also:
- Upvote issues/discussions you want
- Create feature request issue
- Contribute to implementation!

### Q: Can I request a feature?
**A:** Yes! Create a GitHub issue with:
- Feature description
- Use case
- How it should work
- Why you need it

---

## Getting Help

### Q: I'm stuck. Where do I get help?
**A:** 
1. Check this FAQ
2. Read [README.md](README.md)
3. See relevant documentation files
4. Create GitHub discussion
5. Open an issue if it's a bug

### Q: Where can I find examples?
**A:** 
- [API.md](API.md) - API endpoint examples
- `components/` - React component examples
- `app/api/` - API route examples

### Q: How do I contact the maintainer?
**A:** 
- Create GitHub issue
- Start GitHub discussion
- Email: [check project details]

---

## License & Legal

### Q: Can I use this for commercial purposes?
**A:** Yes! It's MIT licensed. See [LICENSE](LICENSE) file.

### Q: Do I need to give credit?
**A:** Not required, but appreciated! MIT license allows use without credit.

### Q: Can I modify the code?
**A:** Yes, MIT license allows modifications. Just follow the license terms.

### Q: What are the license terms?
**A:** MIT License includes:
- Use for any purpose
- Modify as you wish
- No warranty provided
- Include license in distributions

See LICENSE file for full terms.

---

## FAQ Meta

### Q: I have a question not in this FAQ
**A:** 
1. Create GitHub discussion
2. Team will respond and may add to FAQ

### Q: How often is this FAQ updated?
**A:** As new questions arise and new features are added.

**Last Updated**: February 22, 2024
**Questions**: Create GitHub issue or discussion
