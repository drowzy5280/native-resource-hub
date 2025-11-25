# Data Management Guide

This guide explains all the ways to add, update, and manage data in the Native Resource Hub.

## 🎯 Quick Start - Adding Data Now

### Method 1: Run Existing Scripts (Easiest)

```bash
# Add basic seed data (3 tribes, 5 resources, 4 scholarships)
npm run db:seed

# Add additional data (2 tribes, 2 resources, 2 scholarships)
npm run db:add-more

# Add bulk data (10 tribes, 16 resources, 10 scholarships)
npm run db:bulk-seed
```

### Method 2: Use Admin Panel (Web Interface)

1. Go to https://native-resource-hub.vercel.app/admin (or localhost:3000/admin in dev)
2. Sign in with admin account
3. Navigate to:
   - `/admin/resources` - Add resources
   - `/admin/scholarships` - Add scholarships
   - `/admin/tribes` - Add tribes
4. Fill out the forms and submit

**Note:** You need admin access (role: 'admin' in database)

---

## 📊 Available Data Scripts

### 1. Basic Seed (`npm run db:seed`)

**Location:** `prisma/seed.ts`

**What it adds:**
- ✅ 3 Major Tribes (Navajo, Cherokee, Oglala Sioux)
- ✅ 5 Federal/State/Tribal Resources
- ✅ 4 Scholarship Programs

**When to use:** Initial setup, testing, or resetting database

---

### 2. Additional Data (`npm run db:add-more`)

**Location:** `scripts/add-more-data.ts`

**What it adds:**
- ✅ 2 Additional Tribes (Choctaw, Seminole)
- ✅ 2 Federal Resources (Housing, Business Development)
- ✅ 2 STEM Scholarships (AISES, Udall)

**When to use:** After basic seed to expand database

---

### 3. Bulk Seed (`npm run db:bulk-seed`)

**Location:** `scripts/bulk-seed.ts`

**What it adds:**
- ✅ 10 Federally Recognized Tribes across all regions
- ✅ 16 Diverse Resources:
  - Federal programs (housing, education, healthcare, economic development)
  - State programs (CA, OK, NM, WA)
  - Emergency assistance
  - Language preservation
  - Child welfare
- ✅ 10 Major Scholarships:
  - Cobell Scholarship ($2K-$40K)
  - Sequoyah Fellowship ($7.5K-$25K)
  - Wells Fargo, Truman Picard, AIGCS
  - Tribal-specific (Hopi, Navajo)
  - Healthcare career scholarships

**When to use:** Production deployment, showcasing full platform capabilities

---

## 🛠️ Creating Custom Data Scripts

### Example: Add Your Own Tribes

Create `scripts/add-my-tribes.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMyTribes() {
  // Add your tribe
  const myTribe = await prisma.tribe.create({
    data: {
      name: 'Your Tribe Name',
      federalRecognitionStatus: 'Federally Recognized',
      website: 'https://yourtribe.gov',
      languageLinks: ['https://yourlanguage.com'],
      enrollmentOffice: 'Your address',
      region: 'Your Region', // Northwest, Southwest, Great Plains, etc.
    },
  })

  console.log('Added tribe:', myTribe.name)
}

addMyTribes()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
tsx scripts/add-my-tribes.ts
```

---

### Example: Add Resources from CSV

Create `scripts/import-from-csv.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function importCSV() {
  // Read CSV file
  const csv = fs.readFileSync('data/resources.csv', 'utf-8')
  const lines = csv.split('\n').slice(1) // Skip header

  for (const line of lines) {
    const [type, title, description, url, tags, state] = line.split(',')

    await prisma.resource.create({
      data: {
        type: type as any,
        title,
        description,
        url,
        eligibility: [],
        tags: tags.split(';'),
        state: state || null,
        source: 'CSV Import',
      },
    })
  }

  console.log(`Imported ${lines.length} resources`)
}

importCSV()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

---

## 🔄 Using the Admin Panel

### Adding Resources

1. Navigate to `/admin/resources`
2. Click "Add Resource" button
3. Fill out form:
   - **Type:** federal, state, tribal, emergency, scholarship
   - **Title:** Resource name
   - **Description:** What the resource provides
   - **URL:** Website link
   - **Eligibility:** Array of requirements
   - **Tags:** Keywords for filtering
   - **State:** (Optional) For state-specific resources
   - **Tribe ID:** (Optional) For tribal resources

4. Submit (CSRF token auto-generated)

### Adding Scholarships

1. Navigate to `/admin/scholarships`
2. Click "Add Scholarship"
3. Fill out form:
   - **Name:** Scholarship name
   - **Amount:** Dollar range or "Varies"
   - **Deadline:** Date or leave blank for rolling
   - **Description:** What it covers
   - **Tags:** Keywords
   - **Eligibility:** Array of requirements
   - **URL:** Application link

### Adding Tribes

1. Navigate to `/admin/tribes`
2. Click "Add Tribe"
3. Fill out form:
   - **Name:** Official tribe name
   - **Website:** Tribe's website
   - **Region:** Geographic region
   - **Enrollment Office:** Contact address
   - **Language Links:** Array of language resources

---

## 📝 Data Schema Reference

### Resource Type Options
```typescript
type ResourceType =
  | 'federal'    // Federal government programs
  | 'state'      // State-specific programs
  | 'tribal'     // Tribal programs
  | 'emergency'  // Emergency assistance
  | 'scholarship' // Educational scholarships
```

### Common Tags
```typescript
// Education
['education', 'college', 'K-12', 'vocational', 'STEM', 'scholarship']

// Health
['health', 'medical', 'dental', 'mental-health', 'substance-abuse']

// Housing
['housing', 'homeownership', 'rental-assistance', 'home-improvement']

// Economic
['business', 'entrepreneurship', 'loans', 'grants', 'economic-development']

// Emergency
['emergency', 'disaster-relief', 'food', 'utilities', 'financial-assistance']

// Cultural
['language', 'culture', 'cultural-programs', 'preservation']

// Family
['children', 'family-services', 'childcare', 'social-services']
```

### Geographic Regions
```typescript
type Region =
  | 'Northwest'      // WA, OR, ID
  | 'Southwest'      // AZ, NM, NV, UT
  | 'Great Plains'   // MT, WY, ND, SD, NE
  | 'Southern Plains' // OK, TX, KS
  | 'Southeast'      // NC, SC, FL, GA, AL, MS, LA
  | 'Northeast'      // NY, PA, CT, RI, MA, ME, VT, NH
  | 'Midwest'        // WI, MI, MN, IA, IL, IN, OH
  | 'California'     // CA (large enough for own region)
  | 'Alaska'         // AK (unique considerations)
```

---

## 🚀 Best Practices

### 1. Data Validation
Always include:
- ✅ Accurate, up-to-date URLs
- ✅ Clear eligibility requirements
- ✅ Relevant tags for discoverability
- ✅ Source attribution

### 2. Soft Deletes
Never hard delete data:
```typescript
// DON'T DO THIS:
await prisma.resource.delete({ where: { id } })

// DO THIS INSTEAD:
await prisma.resource.update({
  where: { id },
  data: { deletedAt: new Date() }
})
```

### 3. Data Deduplication
Before adding, check if resource already exists:
```typescript
const existing = await prisma.resource.findFirst({
  where: {
    url: newResource.url,
    deletedAt: null,
  }
})

if (!existing) {
  // Create new resource
}
```

### 4. Source Attribution
Always include source:
```typescript
{
  title: 'IHS Healthcare',
  source: 'Indian Health Service', // ✅ Good
  // source: undefined              // ❌ Bad
}
```

---

## 🔍 Querying Data

### Find Resources by Type
```typescript
const federalResources = await prisma.resource.findMany({
  where: {
    type: 'federal',
    deletedAt: null,
  },
  take: 20,
})
```

### Search by Tags
```typescript
const healthResources = await prisma.resource.findMany({
  where: {
    tags: {
      has: 'health',
    },
    deletedAt: null,
  },
})
```

### Find Upcoming Scholarships
```typescript
const upcoming = await prisma.scholarship.findMany({
  where: {
    deadline: {
      gte: new Date(),
    },
    deletedAt: null,
  },
  orderBy: {
    deadline: 'asc',
  },
})
```

---

## 📊 Monitoring Data

### Check Database Counts
```bash
tsx scripts/check-counts.ts
```

Create `scripts/check-counts.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCounts() {
  const counts = {
    tribes: await prisma.tribe.count({ where: { deletedAt: null } }),
    resources: await prisma.resource.count({ where: { deletedAt: null } }),
    scholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
    users: await prisma.user.count({ where: { deletedAt: null } }),
  }

  console.log('Database Statistics:')
  console.log(JSON.stringify(counts, null, 2))
}

checkCounts().finally(() => prisma.$disconnect())
```

---

## 🆘 Troubleshooting

### Issue: "Unique constraint violation"
**Solution:** Resource with same URL already exists. Update instead of create.

### Issue: "Invalid ResourceType"
**Solution:** Use one of: 'federal', 'state', 'tribal', 'emergency', 'scholarship'

### Issue: "Cannot connect to database"
**Solution:** Check DATABASE_URL in `.env` file

### Issue: "Permission denied"
**Solution:** Make sure you're logged in as admin (role: 'admin')

---

## 📚 Additional Resources

- [Prisma Client Docs](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database Schema](./prisma/schema.prisma)
- [API Routes](./app/api/)
- [Admin Panel](./app/admin/)

---

## 🎯 Summary Commands

```bash
# Development
npm run dev                  # Start development server
npm run db:seed             # Add basic data
npm run db:add-more         # Add more data
npm run db:bulk-seed        # Add lots of data

# Database
npm run db:push             # Push schema changes
npm run db:migrate          # Create migration
npm run db:generate         # Regenerate Prisma Client

# Production
npm run build               # Build application
vercel --prod              # Deploy to Vercel
```

---

**Last Updated:** Nov 2025
**Version:** 1.0
