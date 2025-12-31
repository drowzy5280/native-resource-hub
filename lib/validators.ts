import { z } from 'zod'

export const ResourceTypeEnum = z.enum(['federal', 'state', 'tribal', 'scholarship', 'emergency'])
export const UserRoleEnum = z.enum(['user', 'admin'])

export const UserSchema = z.object({
  email: z.string().email(),
  role: UserRoleEnum.optional().default('user'),
  tribeId: z.string().uuid().optional(),
  state: z.string().optional(),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  tags: z.array(z.string()).default([]),
})

export const TribeSchema = z.object({
  name: z.string().min(1),
  federalRecognitionStatus: z.string().optional(),
  website: z.string().url().optional(),
  languageLinks: z.array(z.string().url()).default([]),
  enrollmentOffice: z.string().optional(),
  region: z.string().optional(),
})

export const ResourceSchema = z.object({
  type: ResourceTypeEnum,
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  url: z.string().url().optional(),
  eligibility: z.array(z.string().min(1).max(200)).max(20).default([]),
  tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  state: z.string().max(50).optional(),
  tribeId: z.string().uuid().optional(),
  source: z.string().max(500).optional(),
  // Enhanced fields with proper validation
  videoUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
  requiredDocuments: z.array(z.string().min(1).max(200)).max(20).default([]),
  processingTime: z.string().max(100).optional().nullable(),
  applicationProcess: z.string().max(5000).optional().nullable(),
})

export const ScholarshipSchema = z.object({
  name: z.string().min(1).max(200),
  amount: z.string().max(100).optional(),
  deadline: z.coerce.date().optional(),
  description: z.string().min(1).max(5000),
  tags: z.array(z.string().min(1).max(50)).max(10).default([]),
  eligibility: z.array(z.string().min(1).max(200)).max(20).default([]),
  url: z.string().url().optional(),
  source: z.string().max(500).optional(),
  // Enhanced fields
  videoUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().max(20).optional().nullable(),
  requiredDocuments: z.array(z.string().min(1).max(200)).max(20).default([]),
  applicationProcess: z.string().max(5000).optional().nullable(),
})

export const SaveResourceSchema = z.object({
  userId: z.string().uuid(),
  resourceId: z.string().uuid(),
})

export const ChangeLogSchema = z.object({
  source: z.string().optional(),
  type: z.string(),
  originalValue: z.string().optional(),
  updatedValue: z.string().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
})

export const SearchQuerySchema = z.object({
  q: z.string().min(1).optional(),
  tribe: z.string().optional(),
  state: z.string().optional(),
  tags: z.array(z.string()).optional(),
  type: ResourceTypeEnum.optional(),
})

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'updatedAt', 'name', 'deadline']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export const GrantTypeEnum = z.enum(['federal', 'state', 'tribal', 'foundation', 'corporate'])

// Base grant object schema (without refinements)
const GrantBaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url().optional().nullable(),
  fundingAgency: z.string().optional().nullable(),
  grantType: GrantTypeEnum.default('federal'),
  amount: z.string().optional().nullable(),
  amountMin: z.coerce.number().int().min(0).optional().nullable(),
  amountMax: z.coerce.number().int().min(0).optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  eligibility: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  eligibleApplicants: z.array(z.string()).default([]),
  applicationProcess: z.string().optional().nullable(),
  requiredDocuments: z.array(z.string()).default([]),
  contactEmail: z.string().email().optional().nullable().or(z.literal('')),
  contactPhone: z.string().optional().nullable(),
  cfda: z.string().optional().nullable(),
  opportunityNumber: z.string().optional().nullable(),
  matchingRequired: z.boolean().default(false),
  matchingPercentage: z.coerce.number().min(0).max(100).optional().nullable(),
  renewalEligibility: z.boolean().default(false),
  source: z.string().optional().nullable(),
})

// Full schema with validation refinements (for creation)
export const GrantSchema = GrantBaseSchema.refine(
  (data) => !data.amountMin || !data.amountMax || data.amountMin <= data.amountMax,
  { message: 'amountMin must be less than or equal to amountMax', path: ['amountMin'] }
)

// Partial schema for updates (all fields optional)
export const GrantUpdateSchema = GrantBaseSchema.partial().refine(
  (data) => !data.amountMin || !data.amountMax || data.amountMin <= data.amountMax,
  { message: 'amountMin must be less than or equal to amountMax', path: ['amountMin'] }
)

export const BrokenLinkUpdateSchema = z.object({
  approved: z.boolean(),
})

// Blog Post Schema
export const BlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional().nullable(),
  authorId: z.string().uuid().optional().nullable(),
})

export const BlogPostUpdateSchema = BlogPostSchema.partial()

// FAQ Schema
export const FAQSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
})

export const FAQUpdateSchema = FAQSchema.partial()

// Success Story Schema
export const SuccessStorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  story: z.string().min(1, 'Story is required'),
  authorName: z.string().min(1).max(100),
  authorTribe: z.string().optional(),
  resourceId: z.string().uuid().optional().nullable(),
  scholarshipId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  approved: z.boolean().default(false),
})

export const SuccessStoryUpdateSchema = SuccessStorySchema.partial()

// Resource Guide Schema
export const ResourceGuideSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().min(1),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['getting-started', 'federal-programs', 'state-programs', 'tribal-services', 'education', 'healthcare', 'housing', 'employment']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  estimatedReadTime: z.number().int().min(1).default(5),
  tags: z.array(z.string()).default([]),
  relatedResourceIds: z.array(z.string().uuid()).default([]),
  published: z.boolean().default(false),
})

export const ResourceGuideUpdateSchema = ResourceGuideSchema.partial()

// Contact Form Schema
export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  category: z.enum(['general', 'resource-suggestion', 'bug-report', 'partnership', 'other']).default('general'),
})

// Newsletter Subscription Schema
export const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  interests: z.array(z.enum(['resources', 'scholarships', 'grants', 'news', 'events'])).default(['resources']),
})

// Resource Rating/Review Schema
export const ResourceReviewSchema = z.object({
  resourceId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
  helpful: z.boolean().default(true),
})

// Scholarship Application Tracker Schema
export const ScholarshipApplicationSchema = z.object({
  scholarshipId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['interested', 'preparing', 'submitted', 'under-review', 'accepted', 'rejected', 'withdrawn']).default('interested'),
  notes: z.string().max(2000).optional(),
  submittedAt: z.coerce.date().optional().nullable(),
  deadlineReminder: z.boolean().default(true),
})
