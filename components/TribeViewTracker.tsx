'use client'

import { ViewTracker } from './ViewTracker'

interface TribeViewTrackerProps {
  id: string
  name: string
  description: string
  state?: string | null
}

export function TribeViewTracker({ id, name, description, state }: TribeViewTrackerProps) {
  return (
    <ViewTracker
      item={{
        id,
        type: 'tribe',
        name,
        description,
        metadata: {
          state: state || undefined,
        },
      }}
    />
  )
}
