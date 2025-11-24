'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface NotificationPreferences {
  deadlineReminders: boolean
  weeklyDigest: boolean
  newResourcesAlert: boolean
  daysBefore1: boolean
  daysBefore3: boolean
  daysBefore7: boolean
}

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    deadlineReminders: true,
    weeklyDigest: true,
    newResourcesAlert: false,
    daysBefore1: true,
    daysBefore3: true,
    daysBefore7: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const fetchPreferences = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/signin')
        return
      }

      try {
        const response = await fetch('/api/settings/notifications')
        if (response.ok) {
          const data = await response.json()
          setPreferences(data.preferences)
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [supabase.auth, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        setMessage('Preferences saved successfully!')
      } else {
        setMessage('Failed to save preferences')
      }
    } catch (error) {
      setMessage('An error occurred while saving')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-teal" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-earth-brown">Notification Settings</h1>
        <p className="mt-2 text-earth-brown/70">
          Manage how and when you receive notifications from Native Resource Hub
        </p>
      </div>

      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6 space-y-6">
        {/* Deadline Reminders */}
        <div className="border-b border-earth-sand/30 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-earth-brown">Scholarship Deadline Reminders</h3>
              <p className="text-sm text-earth-brown/70 mt-1">
                Receive email reminders before scholarship deadlines
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.deadlineReminders}
                onChange={(e) =>
                  setPreferences({ ...preferences, deadlineReminders: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-earth-sand peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-earth-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-sand after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-earth-teal"></div>
            </label>
          </div>

          {preferences.deadlineReminders && (
            <div className="mt-4 ml-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.daysBefore7}
                  onChange={(e) =>
                    setPreferences({ ...preferences, daysBefore7: e.target.checked })
                  }
                  className="w-4 h-4 text-earth-teal bg-earth-sand border-earth-sand rounded focus:ring-earth-teal"
                />
                <span className="ml-2 text-sm text-earth-brown">7 days before deadline</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.daysBefore3}
                  onChange={(e) =>
                    setPreferences({ ...preferences, daysBefore3: e.target.checked })
                  }
                  className="w-4 h-4 text-earth-teal bg-earth-sand border-earth-sand rounded focus:ring-earth-teal"
                />
                <span className="ml-2 text-sm text-earth-brown">3 days before deadline</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.daysBefore1}
                  onChange={(e) =>
                    setPreferences({ ...preferences, daysBefore1: e.target.checked })
                  }
                  className="w-4 h-4 text-earth-teal bg-earth-sand border-earth-sand rounded focus:ring-earth-teal"
                />
                <span className="ml-2 text-sm text-earth-brown">1 day before deadline</span>
              </label>
            </div>
          )}
        </div>

        {/* Weekly Digest */}
        <div className="border-b border-earth-sand/30 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-earth-brown">Weekly Digest</h3>
              <p className="text-sm text-earth-brown/70 mt-1">
                Get a weekly email with new resources, scholarships, and upcoming deadlines
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(e) =>
                  setPreferences({ ...preferences, weeklyDigest: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-earth-sand peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-earth-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-sand after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-earth-teal"></div>
            </label>
          </div>
        </div>

        {/* New Resources Alert */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-earth-brown">New Resources Alert</h3>
              <p className="text-sm text-earth-brown/70 mt-1">
                Get notified when new resources matching your interests are added
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newResourcesAlert}
                onChange={(e) =>
                  setPreferences({ ...preferences, newResourcesAlert: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-earth-sand peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-earth-teal rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-earth-sand after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-earth-teal"></div>
            </label>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-earth ${
            message.includes('success')
              ? 'bg-earth-sage/10 text-earth-sage'
              : 'bg-earth-rust/10 text-earth-rust'
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-earth-sand text-earth-brown rounded-earth hover:bg-earth-sand/10 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
