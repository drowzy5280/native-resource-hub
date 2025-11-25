'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TestAuthPage() {
  const [status, setStatus] = useState('Checking...')
  const [user, setUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check Supabase auth
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          setStatus(`Error: ${error.message}`)
          return
        }

        if (!user) {
          setStatus('Not logged in')
          return
        }

        setUser(user)
        setStatus('Logged in!')

        // Check database user
        const response = await fetch('/api/test-user')
        const dbUserData = await response.json()
        setDbUser(dbUserData)
      } catch (err: any) {
        setStatus(`Error: ${err.message}`)
      }
    }

    checkAuth()
  }, [supabase])

  return (
    <div className="min-h-screen bg-earth-cream p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Auth Status Test</h1>

        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>

          {user && (
            <div>
              <strong>Supabase User:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
              </pre>
            </div>
          )}

          {dbUser && (
            <div>
              <strong>Database User:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(dbUser, null, 2)}
              </pre>
            </div>
          )}

          <div className="pt-4 border-t">
            <a href="/auth/signin" className="text-blue-600 underline">
              Go to Sign In
            </a>
            {' | '}
            <a href="/admin" className="text-blue-600 underline">
              Try Admin Page
            </a>
            {' | '}
            <a href="/" className="text-blue-600 underline">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
