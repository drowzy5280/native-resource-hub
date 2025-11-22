# Native Resource Hub

A comprehensive full-stack platform connecting Native American communities with resources, scholarships, and tribal programs.

## Features

- **Resource Discovery**: Browse federal, state, and tribal programs
- **Scholarship Database**: Find scholarships specifically for Native American students
- **Tribal Directory**: Access information about federally recognized tribes
- **AI-Powered Updates**: Automated parsing of public data sources using Claude API
- **Smart Matching**: Filter resources by location, tribe, and tags
- **Authentication**: Secure user accounts with Supabase Auth
- **Automated Maintenance**: Cron jobs for link checking and data updates

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Earth-tone palette)
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **AI**: Claude API (Anthropic)
- **Validation**: Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Supabase account
- Anthropic API key

### Installation

1. Clone the repository:
```bash
cd native-resource-hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
copy .env.example .env
```

Edit `.env` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=your-anthropic-api-key
CRON_SECRET=your-random-secret
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
native-resource-hub/
├── app/
│   ├── api/
│   │   ├── cron/          # Scheduled jobs
│   │   ├── resources/     # Resource endpoints
│   │   ├── scholarships/  # Scholarship endpoints
│   │   ├── tribes/        # Tribe endpoints
│   │   └── user/          # User actions
│   ├── auth/              # Auth callback
│   ├── resources/         # Resource pages
│   ├── scholarships/      # Scholarship pages
│   ├── tribes/            # Tribe pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── lib/
│   ├── ai/               # AI parsing utilities
│   ├── formatting.ts     # Data formatting
│   ├── validators.ts     # Zod schemas
│   ├── fetchers.ts       # API helpers
│   ├── prisma.ts         # Prisma client
│   └── supabase.ts       # Supabase client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── vercel.json           # Vercel config (cron jobs)
```

## Database Schema

### Models

- **User**: User accounts with preferences
- **Tribe**: Federally recognized tribes
- **Resource**: Programs and services
- **Scholarship**: Educational scholarships
- **SavedResource**: User-saved resources
- **ChangeLog**: AI-detected changes

## API Routes

### Tribes
- `GET /api/tribes/list` - List all tribes
- `GET /api/tribes/search?q=` - Search tribes
- `GET /api/tribes/[id]` - Get tribe details

### Resources
- `GET /api/resources/list` - List all resources
- `GET /api/resources/match` - Match resources by criteria
- `GET /api/resources/byTribe/[id]` - Resources by tribe
- `GET /api/resources/byState/[state]` - Resources by state

### Scholarships
- `GET /api/scholarships/list` - List all scholarships
- `GET /api/scholarships/match` - Match scholarships
- `GET /api/scholarships/upcoming` - Upcoming deadlines

### User
- `POST /api/user/saveResource` - Save a resource
- `POST /api/user/removeResource` - Remove saved resource

## Cron Jobs

The application includes three automated tasks:

### Daily (2:00 AM)
- Fetch and parse data from public sources
- Update resources and scholarships
- Log changes for review

### Weekly (3:00 AM Sunday)
- Check all resource links
- Validate tribe websites
- Update scholarship deadlines

### Monthly (4:00 AM 1st of month)
- Remove outdated resources (2+ years old)
- Clean up expired scholarships
- Purge old changelog entries

## AI Integration

The platform uses Claude API to:
- Parse HTML from public data sources
- Extract structured resource information
- Validate data updates
- Maintain data quality

See `lib/ai/parseSource.ts` for implementation details.

## Color Palette

Earth-tone colors used throughout:
- Brown: `#5A4632`
- Tan: `#9E7B52`
- Cream: `#E9E4DB`
- Sand: `#C3B8A1`
- Teal: `#33635C`
- Rust: `#A33F2D`

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically configure cron jobs from `vercel.json`.

### Database Setup (Supabase)

1. Create new Supabase project
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`
4. Enable Row Level Security (optional)

## Development

### Generate Prisma Client
```bash
npm run db:generate
```

### Push Schema Changes
```bash
npm run db:push
```

### Create Migration
```bash
npm run db:migrate
```

### Run Seed Script
```bash
npm run db:seed
```

## Contributing

This platform is designed to serve Native American communities. Contributions should:
- Respect cultural sensitivity
- Maintain data accuracy
- Prioritize user privacy
- Follow accessibility guidelines

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

## Acknowledgments

This platform aggregates publicly available information about resources for Native American communities. All data is sourced from official government and tribal websites.
