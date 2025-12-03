-- Full-Text Search Setup for Native Resource Hub
-- Run this SQL on your production database to enable full-text search
--
-- Prerequisites:
-- 1. PostgreSQL database (Supabase or standalone)
-- 2. Database admin access
--
-- Instructions:
-- For Supabase: Go to SQL Editor and run this entire file
-- For Local/Other: psql -d your_database -f setup-full-text-search.sql

-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram indexes for Resource table
CREATE INDEX IF NOT EXISTS trgm_idx_resource_title ON "Resource" USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trgm_idx_resource_description ON "Resource" USING gin (description gin_trgm_ops);

-- Add trigram indexes for Scholarship table
CREATE INDEX IF NOT EXISTS trgm_idx_scholarship_name ON "Scholarship" USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trgm_idx_scholarship_description ON "Scholarship" USING gin (description gin_trgm_ops);

-- Add trigram indexes for Tribe table
CREATE INDEX IF NOT EXISTS trgm_idx_tribe_name ON "Tribe" USING gin (name gin_trgm_ops);

-- Add full-text search indexes using tsvector for better performance
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED;

ALTER TABLE "Scholarship" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED;

ALTER TABLE "Tribe" ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, ''))
  ) STORED;

-- Create GIN indexes on the tsvector columns
CREATE INDEX IF NOT EXISTS idx_resource_search_vector ON "Resource" USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_scholarship_search_vector ON "Scholarship" USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_tribe_search_vector ON "Tribe" USING gin (search_vector);

-- Add comments explaining the indexes
COMMENT ON INDEX trgm_idx_resource_title IS 'Trigram index for fuzzy search on resource titles';
COMMENT ON INDEX idx_resource_search_vector IS 'Full-text search index for resource search';
COMMENT ON INDEX trgm_idx_scholarship_name IS 'Trigram index for fuzzy search on scholarship names';
COMMENT ON INDEX idx_scholarship_search_vector IS 'Full-text search index for scholarship search';
COMMENT ON INDEX trgm_idx_tribe_name IS 'Trigram index for fuzzy search on tribe names';
COMMENT ON INDEX idx_tribe_search_vector IS 'Full-text search index for tribe search';

-- Verify the setup (optional - run these to test)
-- SELECT * FROM pg_extension WHERE extname = 'pg_trgm';
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('Resource', 'Scholarship', 'Tribe') AND indexname LIKE '%search%';
