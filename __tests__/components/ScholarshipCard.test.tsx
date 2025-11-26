import { render, screen } from '@testing-library/react'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { ToastProvider } from '@/components/Toast'

// Mock child components
jest.mock('@/components/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span data-testid="tag">{label}</span>,
}))

jest.mock('@/components/ShareButton', () => ({
  ShareButton: () => <button data-testid="share-button">Share</button>,
}))

// Helper to render with ToastProvider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ScholarshipCard', () => {
  const mockProps = {
    id: '1',
    name: 'Test Scholarship',
    description: 'This is a test scholarship description',
    amount: '$5,000',
    deadline: '2025-12-31T00:00:00.000Z',
    tags: ['education', 'undergraduate'],
    url: 'https://example.com/scholarship',
  }

  it('should render scholarship card with basic information', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    expect(screen.getByText('Test Scholarship')).toBeInTheDocument()
    expect(screen.getByText('This is a test scholarship description')).toBeInTheDocument()
  })

  it('should render amount when provided', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    expect(screen.getByText('$5,000')).toBeInTheDocument()
  })

  it('should render deadline when provided', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    // The component should format the deadline
    expect(screen.getByText(/Dec|December/)).toBeInTheDocument()
  })

  it('should render tags', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    const tags = screen.getAllByTestId('tag')
    expect(tags.length).toBeGreaterThan(0)
  })

  it('should render "View Details" link', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    const detailsLink = screen.getByText('View Details').closest('a')
    expect(detailsLink).toHaveAttribute('href', '/scholarships/1')
  })

  it('should render "Apply Now" link when url is provided', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    const applyLink = screen.getByText(/Apply/i).closest('a')
    expect(applyLink).toHaveAttribute('href', 'https://example.com/scholarship')
    expect(applyLink).toHaveAttribute('target', '_blank')
    expect(applyLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should not render "Apply Now" link when url is not provided', () => {
    const propsWithoutUrl = {
      ...mockProps,
      url: null,
    }
    renderWithProviders(<ScholarshipCard {...propsWithoutUrl} />)

    expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
  })

  it('should render without amount', () => {
    const propsWithoutAmount = {
      ...mockProps,
      amount: null,
    }
    renderWithProviders(<ScholarshipCard {...propsWithoutAmount} />)

    expect(screen.getByText('Test Scholarship')).toBeInTheDocument()
  })

  it('should render without deadline', () => {
    const propsWithoutDeadline = {
      ...mockProps,
      deadline: null,
    }
    renderWithProviders(<ScholarshipCard {...propsWithoutDeadline} />)

    expect(screen.getByText('Test Scholarship')).toBeInTheDocument()
  })

  it('should render ShareButton component', () => {
    renderWithProviders(<ScholarshipCard {...mockProps} />)

    expect(screen.getByTestId('share-button')).toBeInTheDocument()
  })

  it('should render with minimal props', () => {
    const minimalProps = {
      id: '1',
      name: 'Minimal Scholarship',
      description: 'Minimal description',
      tags: [],
    }
    renderWithProviders(<ScholarshipCard {...minimalProps} />)

    expect(screen.getByText('Minimal Scholarship')).toBeInTheDocument()
    expect(screen.getByText('Minimal description')).toBeInTheDocument()
  })

  it('should handle long descriptions gracefully', () => {
    const propsWithLongDescription = {
      ...mockProps,
      description:
        'This is a very long description that should be truncated to maintain card consistency and prevent the layout from breaking with extremely long text content.',
    }
    renderWithProviders(<ScholarshipCard {...propsWithLongDescription} />)

    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument()
  })

  it('should handle multiple tags', () => {
    const propsWithManyTags = {
      ...mockProps,
      tags: ['education', 'undergraduate', 'graduate', 'stem', 'arts'],
    }
    renderWithProviders(<ScholarshipCard {...propsWithManyTags} />)

    const tags = screen.getAllByTestId('tag')
    expect(tags.length).toBeGreaterThan(0)
  })
})
