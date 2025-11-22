import { z } from 'zod'

export const ResourceTypeEnum = z.enum(['federal', 'state', 'tribal', 'scholarship', 'emergency'])

export const UserSchema = z.object({
  email: z.string().email(),
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
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional(),
  eligibility: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  state: z.string().optional(),
  tribeId: z.string().uuid().optional(),
  source: z.string().optional(),
})

export const ScholarshipSchema = z.object({
  name: z.string().min(1),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  eligibility: z.array(z.string()).default([]),
  url: z.string().url().optional(),
  source: z.string().optional(),
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
