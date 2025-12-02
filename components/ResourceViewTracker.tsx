'use client'

import { ViewTracker } from './ViewTracker'

interface ResourceViewTrackerProps {
  id: string
  name: string
  description: string
  state?: string | null
  tags?: string[]
}

export function ResourceViewTracker({ id, name, description, state, tags }: ResourceViewTrackerProps) {
  return (
    <ViewTracker
      item={{
        id,
        type: 'resource',
        name,
        description,
        metadata: {
          state: state || undefined,
          tags: tags || [],
        },
      }}
    />
  )
}
