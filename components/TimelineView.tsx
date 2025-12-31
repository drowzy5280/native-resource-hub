'use client'

import Link from 'next/link'
import { DeadlineUrgencyIndicator } from './DeadlineCountdown'

interface TimelineItem {
  id: string
  title: string
  date: Date
  type: 'scholarship' | 'grant' | 'resource'
  amount?: string
  url: string
}

interface TimelineViewProps {
  items: TimelineItem[]
  title?: string
  showEmpty?: boolean
  className?: string
}

export function TimelineView({
  items,
  title = 'Upcoming Deadlines',
  showEmpty = true,
  className = '',
}: TimelineViewProps) {
  // Sort by date
  const sortedItems = [...items].sort((a, b) => a.date.getTime() - b.date.getTime())

  // Group by month
  const groupedByMonth: Record<string, TimelineItem[]> = {}
  sortedItems.forEach((item) => {
    const monthKey = item.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = []
    }
    groupedByMonth[monthKey].push(item)
  })

  if (items.length === 0 && !showEmpty) {
    return null
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-xl font-heading font-bold text-text mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {title}
        </h3>
      )}

      {items.length === 0 ? (
        <div className="text-center py-8 bg-desert/20 rounded-earth-lg">
          <svg className="w-12 h-12 text-text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-text-muted">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-desert/50" />

          {Object.entries(groupedByMonth).map(([month, monthItems]) => (
            <div key={month} className="mb-8">
              {/* Month header */}
              <div className="relative flex items-center mb-4">
                <div className="w-8 h-8 bg-pine rounded-full flex items-center justify-center z-10">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="ml-4 font-heading font-semibold text-text">{month}</h4>
              </div>

              {/* Items for this month */}
              <div className="space-y-3 ml-12">
                {monthItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="block bg-white rounded-earth-lg p-4 border border-desert/20 hover:border-pine/50 hover:shadow-soft transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              item.type === 'scholarship'
                                ? 'bg-pine/10 text-pine'
                                : item.type === 'grant'
                                ? 'bg-gold/10 text-gold-dark'
                                : 'bg-clay/10 text-clay'
                            }`}
                          >
                            {item.type}
                          </span>
                          <DeadlineUrgencyIndicator deadline={item.date} />
                        </div>
                        <h5 className="font-medium text-text group-hover:text-pine transition-colors truncate">
                          {item.title}
                        </h5>
                        {item.amount && (
                          <p className="text-sm text-text-muted mt-1">{item.amount}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-text">
                          {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-text-muted">
                          {item.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DeadlineCalendar({
  items,
  className = '',
}: {
  items: TimelineItem[]
  className?: string
}) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Create calendar grid
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Map deadlines to days
  const deadlinesByDay: Record<number, TimelineItem[]> = {}
  items.forEach((item) => {
    if (item.date.getMonth() === currentMonth && item.date.getFullYear() === currentYear) {
      const day = item.date.getDate()
      if (!deadlinesByDay[day]) {
        deadlinesByDay[day] = []
      }
      deadlinesByDay[day].push(item)
    }
  })

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className={`bg-white rounded-earth-xl border border-desert/20 p-6 ${className}`}>
      <h3 className="text-lg font-heading font-bold text-text mb-4">{monthName}</h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const hasDeadlines = day && deadlinesByDay[day]
          const isToday = day === today.getDate()

          return (
            <div
              key={index}
              className={`aspect-square p-1 rounded-earth ${
                day ? 'hover:bg-desert/30' : ''
              } ${isToday ? 'bg-pine/10 ring-1 ring-pine' : ''}`}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <span
                    className={`text-sm ${
                      isToday ? 'font-bold text-pine' : 'text-text-secondary'
                    }`}
                  >
                    {day}
                  </span>
                  {hasDeadlines && (
                    <div className="flex-1 flex flex-wrap gap-0.5 mt-1">
                      {deadlinesByDay[day].slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            item.type === 'scholarship'
                              ? 'bg-pine'
                              : item.type === 'grant'
                              ? 'bg-gold'
                              : 'bg-clay'
                          }`}
                          title={item.title}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-pine" />
          <span>Scholarship</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gold" />
          <span>Grant</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-clay" />
          <span>Resource</span>
        </div>
      </div>
    </div>
  )
}
