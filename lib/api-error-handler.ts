import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Authentication errors
  if (error instanceof Error && error.message === 'Unauthorized') {
    return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
  }

  if (error instanceof Error && error.message.includes('Forbidden')) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }

  // Validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this information already exists' },
        { status: 409 }
      )
    }

    // Record not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    // Foreign key constraint failed
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Referenced record does not exist' }, { status: 400 })
    }
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    )
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Unknown errors
  return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
}
