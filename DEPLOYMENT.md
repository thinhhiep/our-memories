# 🚀 Deployment Guide

Instructions for deploying Our Memories to production.

## Hosting Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides seamless integration.

#### Prerequisites
- [Vercel account](https://vercel.com)
- GitHub repository connected
- Neon database (already set up)

#### Steps

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Deploy to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository `thinhhiep/our-memories`
   - Select Next.js as the framework (auto-detected)
   - Click "Deploy"

3. **Configure Environment Variables**
   - After deployment starts, go to **Project Settings** > **Environment Variables**
   - Add the following:
     ```
     DATABASE_URL=postgresql://neondb_owner:npg_xxxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     POSTGRES_URL=postgresql://neondb_owner:npg_xxxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **DO NOT commit these to GitHub**

4. **Initialize Database**
   - Option A: Run during build (recommended)
   - Option B: Run manually after deployment

5. **Your site is live!**
   - Vercel will assign you a domain like `our-memories.vercel.app`
   - You can also add a custom domain in **Project Settings** > **Domains**

#### Benefits
- Free SSL/HTTPS
- Automatic deployments on git push
- Edge Runtime support (fast API routes)
- Serverless deployment
- Global CDN
- Analytics and monitoring

---

### Option 2: Heroku

#### Prerequisites
- [Heroku account](https://heroku.com)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create our-memories
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DATABASE_URL="postgresql://..."
   heroku config:set POSTGRES_URL="postgresql://..."
   ```

4. **Deploy**
   ```bash
   git push heroku master
   ```

5. **Initialize Database**
   ```bash
   heroku run npm run init-db
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

### Option 3: Railway

#### Prerequisites
- [Railway account](https://railway.app)

#### Steps

1. **Connect GitHub**
   - Go to [https://railway.app](https://railway.app)
   - Click "Start New Project"
   - Deploy from GitHub repo

2. **Add Variables**
   - Go to **Variables** tab
   - Add `DATABASE_URL` and `POSTGRES_URL`

3. **Deploy**
   - Railway automatically deploys on git push

4. **Custom Domain**
   - Add domain in project settings

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] API endpoints tested
- [ ] UI components responsive on mobile
- [ ] All dependencies in package.json
- [ ] No sensitive data in code or git history

## Build Optimization

### 1. Optimize Images

Install and configure image optimization:

```bash
npm install next-image-export-optimizer
```

Update `next.config.mjs`:
```javascript
import withExportImages from "next-image-export-optimizer";

export default withExportImages({
  // ... other config
});
```

### 2. Bundle Analysis

Check bundle size:
```bash
npm install -D @next/bundle-analyzer
```

### 3. Performance Metrics

Monitor Core Web Vitals using Vercel Analytics or Google Analytics.

## Database Backup

### Automatic Backups
Neon provides automatic daily backups. Check the dashboard for backup history.

### Manual Backup

Export database:
```bash
pg_dump $DATABASE_URL > backup.sql
```

Restore database:
```bash
psql $DATABASE_URL < backup.sql
```

## Monitoring & Logging

### Vercel
- Real-time analytics at [vercel.com/dashboard](https://vercel.com/dashboard)
- Edge Function logs
- Performance metrics

### Neon
- Query logs in Neon dashboard
- Connection monitoring
- Performance insights

### Application Monitoring

Add monitoring service (e.g., Sentry):

```bash
npm install @sentry/nextjs
```

## Security Checklist

- [ ] Environment variables not exposed
- [ ] Database credentials rotated
- [ ] HTTPS/SSL enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] Authentication implemented
- [ ] Authorization checks on API routes
- [ ] Audit logging enabled

## Performance Optimization

### Server-Side
- Edge Runtime for API routes (already configured)
- Database query optimization
- Connection pooling (Neon pooler)
- Caching strategies

### Client-Side
- Code splitting
- Image lazy loading
- Asset minification
- Browser caching

### Recommended Vercel Settings

In `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database_url",
    "POSTGRES_URL": "@postgres_url"
  },
  "public": ["public"],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

## Troubleshooting

### Deployment Fails
1. Check build logs in deployment dashboard
2. Verify environment variables are set
3. Ensure database is accessible
4. Check package.json for correct scripts

### Database Connection Issues
1. Verify connection string is correct
2. Check Neon dashboard for database status
3. Ensure database is created and initialized
4. Test locally first: `npm run init-db`

### Slow Performance
1. Check Neon query logs
2. Optimize database queries
3. Enable caching
4. Use pagination for large datasets
5. Optimize image sizes

### 500 Errors
1. Check application logs
2. Verify API route implementation
3. Test with curl/Postman locally
4. Check database integrity

## Rollback

If something goes wrong:

```bash
# Vercel
vercel rollback

# GitHub-based deployments
git revert <commit-hash>
git push
```

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
```

## Cost Estimation

### Free Tier
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Neon**: 3GB storage, 1GB compute
- **GitHub**: Unlimited public repos

### Scaling Costs
- **Vercel**: Pay-as-you-go ($0.50/GB over limit)
- **Neon**: $0.135/GB compute, $0.07/GB storage

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Railway Docs](https://docs.railway.app)
