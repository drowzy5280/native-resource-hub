'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface PaginationParams {
  page?: number
  limit?: number
  type?: string
  search?: string
  tags?: string
}

interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Fetch resources with pagination and filtering
async function fetchResources(params: PaginationParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.type) searchParams.set('type', params.type)
  if (params.search) searchParams.set('search', params.search)
  if (params.tags) searchParams.set('tags', params.tags)

  const response = await fetch(`/api/resources/list?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch resources')
  }
  return response.json()
}

export function useResources(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => fetchResources(params),
  })
}

// Fetch scholarships with pagination and filtering
async function fetchScholarships(params: PaginationParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.tags) searchParams.set('tags', params.tags)

  const response = await fetch(`/api/scholarships/list?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch scholarships')
  }
  return response.json()
}

export function useScholarships(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ['scholarships', params],
    queryFn: () => fetchScholarships(params),
  })
}

// Fetch tribes with pagination and filtering
async function fetchTribes(params: PaginationParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)

  const response = await fetch(`/api/tribes/list?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch tribes')
  }
  return response.json()
}

export function useTribes(params: PaginationParams = {}) {
  return useQuery({
    queryKey: ['tribes', params],
    queryFn: () => fetchTribes(params),
  })
}

// Fetch grants with pagination and filtering
interface GrantParams extends PaginationParams {
  grantType?: string
  agency?: string
  sort?: string
}

async function fetchGrants(params: GrantParams): Promise<PaginatedResponse<any>> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.grantType) searchParams.set('type', params.grantType)
  if (params.agency) searchParams.set('agency', params.agency)
  if (params.search) searchParams.set('search', params.search)
  if (params.tags) searchParams.set('tags', params.tags)
  if (params.sort) searchParams.set('sort', params.sort)

  const response = await fetch(`/api/grants/list?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch grants')
  }
  return response.json()
}

export function useGrants(params: GrantParams = {}) {
  return useQuery({
    queryKey: ['grants', params],
    queryFn: () => fetchGrants(params),
  })
}

// Save resource mutation
export function useSaveResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ resourceId, userId }: { resourceId: string; userId: string }) => {
      const response = await fetch('/api/user/saved/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId, userId }),
      })
      if (!response.ok) {
        throw new Error('Failed to save resource')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate saved resources queries
      queryClient.invalidateQueries({ queryKey: ['savedResources'] })
    },
  })
}

// Remove saved resource mutation
export function useRemoveSavedResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resourceId: string) => {
      const response = await fetch(`/api/user/saved/resources/${resourceId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to remove saved resource')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedResources'] })
    },
  })
}

// Fetch saved resources
export function useSavedResources(userId?: string) {
  return useQuery({
    queryKey: ['savedResources', userId],
    queryFn: async () => {
      const response = await fetch('/api/user/saved/resources')
      if (!response.ok) {
        throw new Error('Failed to fetch saved resources')
      }
      return response.json()
    },
    enabled: !!userId,
  })
}
