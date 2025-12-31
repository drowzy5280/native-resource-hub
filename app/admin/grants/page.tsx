'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Grant {
  id: string
  name: string
  description: string
  amount: string | null
  deadline: string | null
  fundingAgency: string | null
  grantType: string
  tags: string[]
  createdAt: string
}

export default function AdminGrantsPage() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'upcoming' | 'expired'>('all')

  useEffect(() => {
    fetchGrants()
  }, [])

  const fetchGrants = async () => {
    try {
      const response = await fetch('/api/grants/list?limit=100')
      const data = await response.json()
      setGrants(data.grants || [])
    } catch (error) {
      console.error('Failed to fetch grants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this grant?')) return

    try {
      const response = await fetch(`/api/admin/grants/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGrants(grants.filter((g) => g.id !== id))
      } else {
        alert('Failed to delete grant')
      }
    } catch (error) {
      console.error('Failed to delete grant:', error)
      alert('Failed to delete grant')
    }
  }

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch =
      filter === '' ||
      grant.name.toLowerCase().includes(filter.toLowerCase()) ||
      grant.description.toLowerCase().includes(filter.toLowerCase()) ||
      (grant.fundingAgency && grant.fundingAgency.toLowerCase().includes(filter.toLowerCase()))

    const matchesType = typeFilter === 'all' || grant.grantType === typeFilter

    const today = new Date()
    const deadline = grant.deadline ? new Date(grant.deadline) : null

    let matchesDeadline = true
    if (deadlineFilter === 'upcoming') {
      matchesDeadline = deadline ? deadline >= today : false
    } else if (deadlineFilter === 'expired') {
      matchesDeadline = deadline ? deadline < today : false
    }

    return matchesSearch && matchesType && matchesDeadline
  })

  const grantTypeLabels: Record<string, string> = {
    federal: 'Federal',
    state: 'State',
    tribal: 'Tribal',
    foundation: 'Foundation',
    corporate: 'Corporate',
  }

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
          <h1 className="text-3xl font-bold text-earth-brown">Grants</h1>
          <p className="mt-2 text-earth-brown/70">
            Manage all grants on the platform
          </p>
        </div>
        <a
          href="#add-grant"
          className="px-4 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium"
        >
          + Add Grant
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              placeholder="Search by name, agency, or description..."
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            />
          </div>
          <div>
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Grant Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            >
              <option value="all">All Types</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
              <option value="tribal">Tribal</option>
              <option value="foundation">Foundation</option>
              <option value="corporate">Corporate</option>
            </select>
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
              <option value="all">All Grants</option>
              <option value="upcoming">Upcoming Deadlines</option>
              <option value="expired">Expired Deadlines</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grants Table */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-sand/20 border-b border-earth-sand/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Agency
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
                <th className="px-6 py-3 text-right text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-sand/30">
              {filteredGrants.map((grant) => {
                const deadline = grant.deadline
                  ? new Date(grant.deadline)
                  : null
                const isExpired = deadline && deadline < new Date()

                return (
                  <tr key={grant.id} className="hover:bg-earth-sand/10">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-earth-brown truncate">
                          {grant.name}
                        </p>
                        <p className="text-sm text-earth-brown/60 truncate">
                          {grant.description.slice(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-earth-teal/10 text-earth-teal rounded-earth capitalize">
                        {grantTypeLabels[grant.grantType] || grant.grantType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                      {grant.fundingAgency || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                      {grant.amount || '—'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/grants/${grant.id}`}
                          className="text-earth-teal hover:text-earth-teal/80"
                          target="_blank"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(grant.id)}
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

        {filteredGrants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-earth-brown/60">
              {filter || typeFilter !== 'all' || deadlineFilter !== 'all'
                ? 'No grants match your filters'
                : 'No grants found. Add some grants to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="text-sm text-earth-brown/70">
        Showing {filteredGrants.length} of {grants.length} grants
      </div>
    </div>
  )
}
