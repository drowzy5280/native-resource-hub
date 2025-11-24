'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Tribe {
  id: string
  name: string
  region: string | null
  website: string | null
  createdAt: string
}

export default function AdminTribesPage() {
  const [tribes, setTribes] = useState<Tribe[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  useEffect(() => {
    fetchTribes()
  }, [])

  const fetchTribes = async () => {
    try {
      const response = await fetch('/api/tribes/list')
      const data = await response.json()
      setTribes(data.tribes || [])
    } catch (error) {
      console.error('Failed to fetch tribes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tribe?')) return

    try {
      const response = await fetch(`/api/admin/tribes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTribes(tribes.filter((t) => t.id !== id))
      } else {
        alert('Failed to delete tribe')
      }
    } catch (error) {
      console.error('Failed to delete tribe:', error)
      alert('Failed to delete tribe')
    }
  }

  const filteredTribes = tribes.filter((tribe) => {
    const matchesSearch =
      filter === '' ||
      tribe.name.toLowerCase().includes(filter.toLowerCase()) ||
      (tribe.region && tribe.region.toLowerCase().includes(filter.toLowerCase()))

    const matchesRegion =
      regionFilter === '' ||
      (tribe.region && tribe.region.toLowerCase().includes(regionFilter.toLowerCase()))

    return matchesSearch && matchesRegion
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
          <h1 className="text-3xl font-bold text-earth-brown">Tribes</h1>
          <p className="mt-2 text-earth-brown/70">
            Manage tribal directory on the platform
          </p>
        </div>
        <a
          href="#add-tribe"
          className="px-4 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium"
        >
          + Add Tribe
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
              placeholder="Search by name or region..."
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            />
          </div>
          <div>
            <label
              htmlFor="region-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Region
            </label>
            <input
              type="text"
              id="region-filter"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              placeholder="Filter by region..."
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            />
          </div>
        </div>
      </div>

      {/* Tribes Table */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-sand/20 border-b border-earth-sand/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Website
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
              {filteredTribes.map((tribe) => (
                <tr key={tribe.id} className="hover:bg-earth-sand/10">
                  <td className="px-6 py-4">
                    <p className="font-medium text-earth-brown">{tribe.name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {tribe.region || '—'}
                  </td>
                  <td className="px-6 py-4">
                    {tribe.website ? (
                      <a
                        href={tribe.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-earth-teal hover:text-earth-teal/80 text-sm truncate block max-w-xs"
                      >
                        {tribe.website}
                      </a>
                    ) : (
                      <span className="text-sm text-earth-brown/70">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {new Date(tribe.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/tribes/${tribe.id}`}
                        className="text-earth-teal hover:text-earth-teal/80"
                        target="_blank"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(tribe.id)}
                        className="text-earth-rust hover:text-earth-rust/80"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTribes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-earth-brown/60">
              {filter || regionFilter
                ? 'No tribes match your filters'
                : 'No tribes found'}
            </p>
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="text-sm text-earth-brown/70">
        Showing {filteredTribes.length} of {tribes.length} tribes
      </div>
    </div>
  )
}
