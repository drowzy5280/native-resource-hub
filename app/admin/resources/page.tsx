'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  state: string | null
  url: string
  tags: string[]
  createdAt: string
  tribe?: { id: string; name: string } | null
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources/list')
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setResources(resources.filter((r) => r.id !== id))
      } else {
        alert('Failed to delete resource')
      }
    } catch (error) {
      console.error('Failed to delete resource:', error)
      alert('Failed to delete resource')
    }
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      filter === '' ||
      resource.title.toLowerCase().includes(filter.toLowerCase()) ||
      resource.description.toLowerCase().includes(filter.toLowerCase())

    const matchesType = typeFilter === '' || resource.type === typeFilter

    return matchesSearch && matchesType
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
          <h1 className="text-3xl font-bold text-earth-brown">Resources</h1>
          <p className="mt-2 text-earth-brown/70">
            Manage all resources on the platform
          </p>
        </div>
        <a
          href="#add-resource"
          className="px-4 py-2 bg-earth-teal text-white rounded-earth hover:bg-earth-teal/90 transition-colors font-medium"
        >
          + Add Resource
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
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            />
          </div>
          <div>
            <label
              htmlFor="type-filter"
              className="block text-sm font-medium text-earth-brown mb-2"
            >
              Type
            </label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-earth-sand rounded-earth focus:outline-none focus:ring-2 focus:ring-earth-teal"
            >
              <option value="">All Types</option>
              <option value="federal">Federal</option>
              <option value="state">State</option>
              <option value="tribal">Tribal</option>
              <option value="emergency">Emergency</option>
              <option value="scholarship">Scholarship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-sand/20 border-b border-earth-sand/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Tribe
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
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-earth-sand/10">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-earth-brown truncate">
                        {resource.title}
                      </p>
                      <p className="text-sm text-earth-brown/60 truncate">
                        {resource.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-earth-teal/10 text-earth-teal rounded-earth">
                      {resource.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {resource.state || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {resource.tribe?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/resources/${resource.id}`}
                        className="text-earth-teal hover:text-earth-teal/80"
                        target="_blank"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(resource.id)}
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

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-earth-brown/60">
              {filter || typeFilter
                ? 'No resources match your filters'
                : 'No resources found'}
            </p>
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="text-sm text-earth-brown/70">
        Showing {filteredResources.length} of {resources.length} resources
      </div>
    </div>
  )
}
