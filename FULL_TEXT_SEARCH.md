# Full-Text Search Setup Guide

This guide explains how to set up and use the PostgreSQL full-text search functionality in the Native Resource Hub.

## Overview

The application now supports advanced full-text search using PostgreSQL's `pg_trgm` (trigram) extension and `tsvector` for fast, fuzzy, and typo-tolerant searching.

### Features

- **Trigram Similarity Search**: Finds results even with typos (e.g., "edukation" finds "education")
- **Full-Text Search**: Fast keyword matching using PostgreSQL's native full-text search
- **Ranked Results**: Results are sorted by relevance, not just alphabetically
- **Automatic Fallback**: If full-text search isn't set up, the app falls back to basic search
- **Smart Suggestions**: Autocomplete suggestions use the same fuzzy matching

## Setup Instructions

### Prerequisites

- PostgreSQL database (Supabase or local)
- Database connection string in `.env`
- Prisma CLI installed

### Step 1: Run the Setup Script

```bash
npm run db:setup-search
```

This script will:
1. Enable the `pg_trgm` extension in your database
2. Create trigram indexes on all searchable text fields
3. Add `tsvector` columns for full-text search
4. Create GIN indexes for optimal performance
5. Test the setup to ensure it's working

### Step 2: Verify the Setup

The setup script will automatically test the installation. You should see output like:

```
✅ Full-text search is working!
Sample results:
  1. Native American Education Programs (similarity: 0.856)
  2. Educational Support Services (similarity: 0.723)
  3. Higher Education Scholarships (similarity: 0.689)
```

## How It Works

### Trigram Similarity

Trigrams break text into 3-character chunks. For example, "education" becomes:
```
"  e", " ed", "edu", "duc", "uca", "cat", "ati", "tio", "ion", "on "
```

When searching, PostgreSQL compares these chunks to find similar words, even with typos.

### Full-Text Search Vectors

The `search_vector` columns contain pre-processed, searchable versions of your content:
- **Weight A**: Titles/names (higher importance)
- **Weight B**: Descriptions (lower importance)

### Query Performance

With indexes in place:
- **Without full-text search**: ~500-1000ms for complex searches
- **With trigram indexes**: ~50-150ms
- **With tsvector**: ~10-50ms

## Usage in Code

### Basic Search

```typescript
import { searchResources, searchScholarships, searchTribes } from '@/lib/search'

// Search resources
const results = await searchResources('education', {
  limit: 20,
  useFullTextSearch: true, // Use tsvector (fast)
})

// Or use trigram for fuzzy matching
const fuzzyResults = await searchResources('edukation', {
  limit: 20,
  useFullTextSearch: false, // Use trigram (typo-tolerant)
  minSimilarity: 0.3, // Minimum similarity score (0-1)
})
```

### Universal Search

Search across all entity types at once:

```typescript
import { universalSearch } from '@/lib/search'

const results = await universalSearch('health', {
  limit: 10,
  useFullTextSearch: true,
})

console.log(results.resources) // Array of matching resources
console.log(results.scholarships) // Array of matching scholarships
console.log(results.tribes) // Array of matching tribes
```

### Search Suggestions

```typescript
import { getSearchSuggestions } from '@/lib/search'

const suggestions = await getSearchSuggestions('edu', 8)
// Returns: [{ text: 'education', type: 'tag' }, ...]
```

## Database Schema Changes

The migration adds the following to your database:

### New Columns

- `Resource.search_vector` (tsvector)
- `Scholarship.search_vector` (tsvector)
- `Tribe.search_vector` (tsvector)

These are **generated columns** - they're automatically updated when the title/description changes.

### New Indexes

- `trgm_idx_resource_title` - Trigram index on Resource titles
- `trgm_idx_resource_description` - Trigram index on Resource descriptions
- `trgm_idx_scholarship_name` - Trigram index on Scholarship names
- `trgm_idx_scholarship_description` - Trigram index on Scholarship descriptions
- `trgm_idx_tribe_name` - Trigram index on Tribe names
- `idx_resource_search_vector` - GIN index for Resource full-text search
- `idx_scholarship_search_vector` - GIN index for Scholarship full-text search
- `idx_tribe_search_vector` - GIN index for Tribe full-text search

## API Endpoints

### Search Suggestions

**GET** `/api/search/suggestions?q=edu`

Returns autocomplete suggestions:
```json
{
  "suggestions": [
    { "text": "education", "type": "tag" },
    { "text": "Educational Support Programs", "type": "resource" },
    { "text": "College Education Scholarship", "type": "scholarship" }
  ]
}
```

### Search Results

The main search page (`/search?q=education`) automatically uses full-text search when available.

## Troubleshooting

### "Extension pg_trgm does not exist"

If you're using Supabase:
1. Go to your Supabase project dashboard
2. Navigate to Database → Extensions
3. Enable `pg_trgm` extension
4. Run the setup script again

For local PostgreSQL:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### "Column search_vector does not exist"

The migration didn't complete. Run:
```bash
npm run db:setup-search
```

If it still fails, manually run the SQL from:
```
prisma/migrations/full-text-search/migration.sql
```

### Search Returns No Results

Check that:
1. The extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'pg_trgm';`
2. Indexes exist: `\di` in psql or check Supabase Table Editor
3. Data exists in your database
4. The search term has at least 3 characters

### Performance Issues

If searches are slow:
1. Check that indexes exist: `\d+ "Resource"` in psql
2. Vacuum and analyze: `VACUUM ANALYZE "Resource";`
3. Check index usage: `EXPLAIN ANALYZE SELECT ... WHERE title % 'term';`

## Best Practices

### When to Use Full-Text Search

Use `useFullTextSearch: true` when:
- Searching for exact words or phrases
- Performance is critical
- Users are typing correct spellings

### When to Use Trigram Search

Use `useFullTextSearch: false` when:
- Users might have typos
- Searching for partial words
- Need fuzzy matching

### Optimizing Queries

```typescript
// ✅ Good - specific limit
const results = await searchResources('health', { limit: 20 })

// ❌ Avoid - too many results
const results = await searchResources('health', { limit: 1000 })

// ✅ Good - filter by similarity
const results = await searchResources('helth', {
  useFullTextSearch: false,
  minSimilarity: 0.4, // Only return decent matches
})
```

## Performance Monitoring

To monitor search performance:

```typescript
const start = Date.now()
const results = await searchResources('education')
console.log(`Search took ${Date.now() - start}ms`)
```

Typical response times:
- **< 50ms**: Excellent
- **50-200ms**: Good
- **200-500ms**: Acceptable
- **> 500ms**: Investigate

## Future Enhancements

Planned improvements:
- [ ] Search result highlighting
- [ ] Search analytics (track popular queries)
- [ ] Personalized search ranking
- [ ] Multi-language support
- [ ] Search filters (by state, type, tags)
- [ ] Advanced operators (AND, OR, NOT)

## Additional Resources

- [PostgreSQL Full-Text Search Docs](https://www.postgresql.org/docs/current/textsearch.html)
- [pg_trgm Extension Docs](https://www.postgresql.org/docs/current/pgtrgm.html)
- [Supabase Full-Text Search Guide](https://supabase.com/docs/guides/database/full-text-search)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs: `npm run dev` and check console
3. Test with simple queries first ("education", "health")
4. Verify database connection and permissions
