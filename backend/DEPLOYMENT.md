# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account** - https://vercel.com
2. **PostgreSQL Database** - Use one of:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech) (recommended - free tier)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

## Step 1: Set Up PostgreSQL Database

1. Create a PostgreSQL database on Neon/Supabase/Railway
2. Get the connection string
3. Note: You'll need `host`, `port`, `username`, `password`, `database`

## Step 2: Deploy to Vercel

### Option A: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from backend directory
cd backend
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: nova-commerce-api
# - Directory where code is located: ./
# - Want to override settings? N

# Deploy to production
vercel --prod
```

### Option B: Via GitHub
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
5. Deploy

## Step 3: Set Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
DB_HOST=your-db-host.neon.tech
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=nova_commerce
DB_SSL=true
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-chars
JWT_REFRESH_EXPIRES_IN=7d
APP_ENV=production
CORS_ORIGINS=https://your-app.vercel.app,https://customer-app.vercel.app
SMS_PROVIDER=dev
GOOGLE_MAPS_API_KEY=your_key
```

## Step 4: Update Frontend Apps

After deployment, update the API URL in:

1. **nova_core** `api_constants.dart`:
   ```dart
   static const String baseUrl = 'https://nova-commerce-api.vercel.app';
   ```

2. **delivery_app** `app_config.dart`:
   ```dart
   static const String apiBaseUrl = 'https://nova-commerce-api.vercel.app';
   ```

3. Rebuild and redeploy the Flutter apps

## Step 5: Run Initial Seed (Optional)

The database will auto-sync schema on first deploy. To seed data:
- The seed runs automatically in development mode
- In production, you can trigger it by calling: `POST /api/v1/seed`

## Important Notes

### WebSocket Support
Vercel doesn't support WebSocket connections. For real-time features:
- Use [Railway](https://railway.app) for WebSocket server
- Or use [Socket.io Cloud](https://socket.io)

### File Uploads
Vercel serverless functions have a 4.5MB body size limit. For file uploads:
- Use S3/Cloudflare R2 directly from the client
- Or use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

### Database Connection Pooling
For production, use connection pooling:
- Neon provides built-in pooling
- Or use [PgBouncer](https://www.pgbouncer.org/)

## Troubleshooting

### Build Fails
- Check Node.js version (need 18+)
- Ensure all dependencies are in package.json

### Database Connection Fails
- Verify DB_SSL=true is set
- Check connection string format
- Ensure database allows connections from Vercel IPs

### CORS Errors
- Add your frontend URLs to CORS_ORIGINS
- Include both www and non-www versions
