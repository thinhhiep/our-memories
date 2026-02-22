# 🔧 Database Setup Guide

This guide walks you through setting up the Neon PostgreSQL database for the Our Memories application.

## Prerequisites

- A [Neon](https://neon.tech/) account (free tier available)
- Node.js 18+
- Git

## Step 1: Create Neon Database

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Sign up or log in to your account
3. Click **New Project**
4. Enter project name: `our-memories`
5. Click **Create Project**
6. Wait for the database to be created (usually takes a few seconds)

## Step 2: Get Connection String

1. In the Neon dashboard, go to your project
2. Click on the **main** database
3. You'll see several connection string options:
   - **Connection string**: Use the one marked "Recommended for most uses" (with pooler)
   - Copy the connection string that looks like:
     ```
     postgresql://neondb_owner:npg_xxxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```

## Step 3: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and paste your connection strings:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_xxxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   POSTGRES_URL=postgresql://neondb_owner:npg_xxxxxx@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

3. Save the file (DO NOT commit this file to git - it's in `.gitignore`)

## Step 4: Install Dependencies

```bash
npm install
```

This includes:
- `@vercel/postgres` - Database connection
- `dotenv` - Environment variable loading
- `tsx` - TypeScript execution

## Step 5: Initialize Database

Run the initialization script:

```bash
npm run init-db
```

You should see output like:
```
🔄 Initializing database tables...
📊 Creating sub_albums table...
🖼️  Creating images table...
🔗 Creating sub_album_images junction table...
🔐 Creating share_tokens table...
📝 Creating audit_logs table...
⚡ Creating indexes...
✅ Database initialization completed successfully!
```

If you see an error like "missing_connection_string", make sure:
1. Your `.env.local` file exists
2. `DATABASE_URL` or `POSTGRES_URL` is set correctly
3. You're running the command from the project root directory

## Step 6: Verify Database

You can verify the tables were created by:

1. Going to Neon dashboard
2. Clicking on **SQL Editor**
3. Running this query:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

You should see:
- `sub_albums`
- `images`
- `sub_album_images`
- `share_tokens`
- `audit_logs`

## Step 7: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you're ready to go!

## Database Schema

### sub_albums Table
Stores album metadata:
- `id` - UUID primary key
- `user_id` - User identifier
- `title` - Album title
- `description` - Album description
- `start_date` - Album start date
- `end_date` - Album end date
- `tags` - Array of tags
- `visibility` - 'private', 'link', or 'public'
- `cover_image_id` - Reference to cover image
- `created_at` - Timestamp
- `updated_at` - Timestamp

### images Table
Stores image metadata:
- `id` - Text primary key (usually from blob storage)
- `user_id` - User identifier
- `url` - Image URL
- `thumb_url` - Thumbnail URL
- `caption` - Image caption
- `date` - Photo date
- `tags` - Array of tags
- `metadata` - JSON metadata
- `uploaded_at` - Timestamp

### sub_album_images Table
Junction table linking albums to images:
- `id` - UUID primary key
- `sub_album_id` - Reference to sub_albums
- `image_id` - Reference to images
- `position` - Display order
- `added_at` - When added to album

### share_tokens Table
For public sharing functionality:
- `id` - UUID primary key
- `sub_album_id` - Album being shared
- `token` - Unique token
- `password_hash` - Optional password
- `created_by` - User who created share
- `created_at` - Timestamp
- `expires_at` - Optional expiry date
- `is_active` - Active status

### audit_logs Table
Activity tracking:
- `id` - UUID primary key
- `user_id` - User performing action
- `action` - Action type (create, update, delete)
- `entity_type` - Album or image
- `entity_id` - ID of affected entity
- `changes` - JSON of changes
- `created_at` - Timestamp

## Troubleshooting

### "missing_connection_string" Error
- Check that `.env.local` exists in project root
- Verify `DATABASE_URL` is correctly set
- Make sure you're running from the correct directory

### Connection Timeout
- Check your internet connection
- Verify the Neon database is running in the dashboard
- Ensure the connection string is correct (check for typos)

### Permission Denied
- Verify you're using the correct password from Neon dashboard
- Check that your IP is allowed (Neon allows all by default)

### Table Already Exists
This is normal! The script uses `CREATE TABLE IF NOT EXISTS`, so you can run it multiple times safely.

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` for a reason
2. **Use `.env.example`** - For team members to know what variables are needed
3. **Rotate passwords** - Consider changing your database password periodically
4. **Use connection pooling** - The pooler connection string is recommended
5. **Limit connections** - Neon free tier allows up to 10 concurrent connections

## Next Steps

- Review the [API documentation](./API.md)
- Check out example API requests in `curl` or Postman
- Start building features!

For more help, see the [Neon documentation](https://neon.tech/docs/).
