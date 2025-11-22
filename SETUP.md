# Setup Guide

Complete setup instructions for Native Resource Hub.

## Step-by-Step Setup

### 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to provision
4. Go to Project Settings > API
5. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
6. Go to Project Settings > Database
7. Copy connection string → `DATABASE_URL`
   - Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### 2. Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Go to API Keys
4. Create a new key
5. Copy to `ANTHROPIC_API_KEY`

### 3. Environment Variables

Create `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...

# Cron Secret (generate random string)
CRON_SECRET=your-random-secret-at-least-32-chars
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Database Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables
- Set up relationships
- Generate Prisma Client

### 6. Seed Database

```bash
npm run db:seed
```

This adds sample data:
- 3 tribes
- 5 resources
- 4 scholarships

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/native-resource-hub.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `CRON_SECRET`
4. Deploy

### 3. Run Migrations on Production

```bash
npx prisma migrate deploy
```

### 4. Seed Production Database (Optional)

```bash
npm run db:seed
```

## Supabase Auth Configuration

### Enable Email Auth

1. Go to Authentication > Providers
2. Enable Email provider
3. Disable email confirmations (or configure SMTP)

### Enable OAuth (Optional)

1. Go to Authentication > Providers
2. Enable Google
3. Add OAuth credentials from Google Cloud Console
4. Add authorized redirect URL:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## Testing Cron Jobs Locally

Cron jobs require authentication header:

```bash
curl -H "Authorization: Bearer your-cron-secret" http://localhost:3000/api/cron/daily
```

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure you're using the connection pooler URL for production

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Supabase Auth Not Working

- Check redirect URLs are configured
- Verify environment variables are correct
- Check browser console for errors

## Next Steps

1. Customize tribal data sources in `app/api/cron/daily/route.ts`
2. Add more seed data in `prisma/seed.ts`
3. Configure email templates in Supabase
4. Set up monitoring and error tracking
5. Add analytics (optional)

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seed data added (optional)
- [ ] Cron jobs configured in Vercel
- [ ] Auth redirect URLs set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Error tracking configured
- [ ] Backups enabled in Supabase
- [ ] Rate limiting configured (optional)
