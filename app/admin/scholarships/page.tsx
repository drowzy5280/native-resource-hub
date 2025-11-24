'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Scholarship {
  id: string
  name: string
  description: string
  amount: string | null
  deadline: string | null
  eligibility: string | null
  url: string
  tags: string[]
  createdAt: string
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'upcoming' | 'expired'>('all')

  useEffect(() => {
    fetchScholarships()
  }, [])

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarships/list')
      const data = await response.json()
      setScholarships(data.scholarships || [])
    } catch (error) {
      console.error('Failed to fetch scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return

    try {
      const response = await fetch(`/api/admin/scholarships/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setScholarships(scholarships.filter((s) => s.id !== id))
      } else {
        alert('Failed to delete scholarship')
      }
    } catch (error) {
      console.error('Failed to delete scholarship:', error)
      alert('Failed to delete scholarship')
    }
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      filter === '' ||
      scholarship.name.toLowerCase().includes(filter.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(filter.toLowerCase())

    const today = new Date()
    const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null

    let matchesDeadline = true
    if (deadlineFilter === 'upcoming') {
      matchesDeadline = deadline ? deadline >= today : false
    } else if (deadlineFilter === 'expired') {
      matchesDeadline = deadline ? deadline < today : false
    }

    return matchesSearch && matchesDeadline
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-earth-brown">Scholarships</h1>
          <p className="mt-2 text-earth-brown/70">
            Manage all scholarships on the platform
          </p>
        </div>
        <a
          href="#add-scholarship"
          className="px-4 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium"
        >
          + Add Scholarship
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            />
          </div>
          <div>
            <label
              htmlFor="deadline-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Deadline Status
            </label>
            <select
              id="deadline-filter"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            >
              <option value="all">All Scholarships</option>
              <option value="upcoming">Upcoming Deadlines</option>
              <option value="expired">Expired Deadlines</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships Table */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-sand/20 border-b border-earth-sand/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-sand/30">
              {filteredScholarships.map((scholarship) => {
                const deadline = scholarship.deadline
                  ? new Date(scholarship.deadline)
                  : null
                const isExpired = deadline && deadline < new Date()

                return (
                  <tr key={scholarship.id} className="hover:bg-earth-sand/10">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-earth-brown truncate">
                          {scholarship.name}
                        </p>
                        <p className="text-sm text-earth-brown/60 truncate">
                          {scholarship.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                      {scholarship.amount || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                      {deadline
                        ? deadline.toLocaleDateString()
                        : 'Rolling'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deadline ? (
                        isExpired ? (
                          <span className="px-2 py-1 text-xs font-medium bg-earth-rust/10 text-earth-rust rounded-earth">
                            Expired
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-earth-sage/10 text-earth-sage rounded-earth">
                            Active
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-earth-teal/10 text-earth-teal rounded-earth">
                          Rolling
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                      {new Date(scholarship.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/scholarships/${scholarship.id}`}
                          className="text-earth-teal hover:text-earth-teal/80"
                          target="_blank"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(scholarship.id)}
                          className="text-earth-rust hover:text-earth-rust/80"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-earth-brown/60">
              {filter || deadlineFilter !== 'all'
                ? 'No scholarships match your filters'
                : 'No scholarships found'}
            </p>
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="text-sm text-earth-brown/70">
        Showing {filteredScholarships.length} of {scholarships.length}{' '}
        scholarships
      </div>
    </div>
  )
}
