'use client'

import { ViewTracker } from './ViewTracker'

interface ScholarshipViewTrackerProps {
  id: string
  name: string
  description: string
  amount?: string | null
  deadline?: Date | null
  state?: string | null
}

export function ScholarshipViewTracker({ id, name, description, amount, deadline, state }: ScholarshipViewTrackerProps) {
  return (
    <ViewTracker
      item={{
        id,
        type: 'scholarship',
        name,
        description,
        metadata: {
          amount: amount || undefined,
          deadline: deadline ? new Date(deadline).toISOString() : undefined,
          state: state || undefined,
        },
      }}
    />
  )
}
