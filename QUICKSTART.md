# Quick Start Guide

Get Native Resource Hub running in 5 minutes.

## Prerequisites
- Node.js 18+
- Supabase account
- Anthropic API key

## Installation

```bash
# 1. Navigate to project
cd native-resource-hub

# 2. Install dependencies
npm install

# 3. Copy environment variables
copy .env.example .env

# 4. Edit .env with your credentials
# Add your Supabase and Anthropic keys

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed sample data
npm run db:seed

# 7. Start development server
npm run dev
```

Visit http://localhost:3000

## What You'll See

- **Home Page**: Search bar, resource categories, recent resources
- **Resources**: Browse federal, state, and tribal programs
- **Tribes**: Directory of federally recognized tribes
- **Scholarships**: Native American scholarships with deadlines

## Sample Data

The seed script creates:
- 3 tribes (Navajo Nation, Cherokee Nation, Oglala Sioux)
- 5 resources (IHS, BIE grants, housing, emergency aid, state scholarships)
- 4 scholarships (AICF, Catching the Dream, Gates, Cherokee Nation)

## Key Files to Customize

### Add Data Sources
Edit `app/api/cron/daily/route.ts` to add your data sources:
```typescript
const sources = [
  { url: 'https://example.com/resources', type: 'resource' },
]
```

### Modify Seed Data
Edit `prisma/seed.ts` to add more tribes, resources, or scholarships.

### Customize Colors
Edit `tailwind.config.ts` to change the earth-tone palette.

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Create migration
npm run db:seed         # Seed database

# Lint
npm run lint            # Run ESLint
```

## Project Structure

```
app/
├── api/               # API routes
├── resources/         # Resource pages
├── scholarships/      # Scholarship pages
├── tribes/            # Tribe pages
└── page.tsx          # Home page

components/            # UI components
lib/                  # Utilities & AI
prisma/               # Database schema
```

## Testing Locally

### Test API Endpoints
```bash
# List tribes
curl http://localhost:3000/api/tribes/list

# List resources
curl http://localhost:3000/api/resources/list

# Upcoming scholarships
curl http://localhost:3000/api/scholarships/upcoming
```

### Test Cron Jobs
```bash
# Daily job
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron/daily

# Weekly job
curl -H "Authorization: Bearer your-cron-secret" \
  http://localhost:3000/api/cron/weekly
```

## Next Steps

1. **Add Real Data**: Replace seed data with actual tribal resources
2. **Configure Sources**: Set up data sources for automated updates
3. **Deploy**: Push to Vercel for production deployment
4. **Monitor**: Set up error tracking and analytics

## Troubleshooting

**Database connection error?**
- Check `DATABASE_URL` in `.env`
- Verify Supabase project is active

**Build errors?**
```bash
rm -rf .next node_modules
npm install
```

**Prisma issues?**
```bash
npx prisma generate
```

## Support

- See `README.md` for full documentation
- See `SETUP.md` for detailed setup instructions
- Check Prisma schema: `prisma/schema.prisma`

## Production Deployment

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main

# 2. Deploy to Vercel
# - Import GitHub repo
# - Add environment variables
# - Deploy

# 3. Run production migrations
npx prisma migrate deploy
```

That's it! You now have a fully functional Native Resource Hub.
