'use client'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ResourceStats = {
  totalResources: number
  totalScholarships: number
  resourcesByType: { name: string; value: number; color: string }[]
  resourcesByState: { state: string; count: number }[]
  scholarshipsByAmount: { range: string; count: number }[]
  recentlyAdded: number
}

type ResourceStatsDashboardProps = {
  stats: ResourceStats
}

export function ResourceStatsDashboard({ stats }: ResourceStatsDashboardProps) {
  // Custom label for pie chart
  const renderCustomLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`
  }

  // Top 10 states for bar chart
  const topStates = stats.resourcesByState
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pine/10 to-pine/5 rounded-earth-lg p-6 border border-pine/20">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-pine/20 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text mb-1">
            {stats.totalResources.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary font-medium">Total Resources</div>
        </div>

        <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-earth-lg p-6 border border-gold/20">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gold/20 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text mb-1">
            {stats.totalScholarships.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary font-medium">Scholarships</div>
        </div>

        <div className="bg-gradient-to-br from-clay/10 to-clay/5 rounded-earth-lg p-6 border border-clay/20">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-clay/20 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text mb-1">
            {stats.resourcesByState.length}
          </div>
          <div className="text-sm text-text-secondary font-medium">States Covered</div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-earth-lg p-6 border border-success/20">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-success/20 rounded-earth flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text mb-1">
            +{stats.recentlyAdded}
          </div>
          <div className="text-sm text-text-secondary font-medium">Added This Month</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resources by Type - Pie Chart */}
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <h3 className="text-xl font-heading font-bold text-text mb-6">Resources by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.resourcesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.resourcesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.resourcesByType.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-earth flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-text-secondary">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top States - Bar Chart */}
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <h3 className="text-xl font-heading font-bold text-text mb-6">Top 10 States by Resources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C1" />
              <XAxis
                dataKey="state"
                tick={{ fill: '#6B6560', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#6B6560', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9C5B0',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <Bar dataKey="count" fill="#4A6F4F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scholarship Amounts Distribution */}
      <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
        <h3 className="text-xl font-heading font-bold text-text mb-6">Scholarship Award Amounts</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats.scholarshipsByAmount} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D4C1" />
            <XAxis
              type="category"
              dataKey="range"
              tick={{ fill: '#6B6560', fontSize: 12 }}
            />
            <YAxis type="number" tick={{ fill: '#6B6560', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9C5B0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
            <Bar dataKey="count" fill="#D9A566" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {stats.scholarshipsByAmount.map((item) => (
            <div key={item.range} className="text-center">
              <div className="text-2xl font-bold text-text">{item.count}</div>
              <div className="text-xs text-text-secondary">{item.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pine/10 rounded-earth flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text">
                {stats.resourcesByType.find(t => t.name === 'Housing')?.value || 0}
              </div>
              <div className="text-sm text-text-secondary">Housing Programs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-clay/10 rounded-earth flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text">
                {stats.resourcesByType.find(t => t.name === 'Healthcare')?.value || 0}
              </div>
              <div className="text-sm text-text-secondary">Healthcare Resources</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-earth flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-text">
                {stats.resourcesByType.find(t => t.name === 'Employment')?.value || 0}
              </div>
              <div className="text-sm text-text-secondary">Employment Programs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
