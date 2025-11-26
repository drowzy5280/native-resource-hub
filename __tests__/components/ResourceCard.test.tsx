import { render, screen } from '@testing-library/react'
import { ResourceCard } from '@/components/ResourceCard'
import { ToastProvider } from '@/components/Toast'

// Mock child components
jest.mock('@/components/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span data-testid="tag">{label}</span>,
}))

jest.mock('@/components/SaveButton', () => ({
  SaveButton: () => <button data-testid="save-button">Save</button>,
}))

jest.mock('@/components/ShareButton', () => ({
  ShareButton: () => <button data-testid="share-button">Share</button>,
}))

// Helper to render with ToastProvider
const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ResourceCard', () => {
  const mockProps = {
    id: '1',
    title: 'Test Resource',
    description: 'This is a test resource description',
    type: 'federal',
    tags: ['education', 'health', 'housing'],
    state: 'CA',
    url: 'https://example.com',
  }

  it('should render resource card with basic information', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    expect(screen.getByText('Test Resource')).toBeInTheDocument()
    expect(screen.getByText('This is a test resource description')).toBeInTheDocument()
    expect(screen.getByText('federal')).toBeInTheDocument()
    expect(screen.getByText('CA')).toBeInTheDocument()
  })

  it('should render tags (maximum 3 visible)', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    const tags = screen.getAllByTestId('tag')
    expect(tags).toHaveLength(3)
    expect(screen.getByText('education')).toBeInTheDocument()
    expect(screen.getByText('health')).toBeInTheDocument()
    expect(screen.getByText('housing')).toBeInTheDocument()
  })

  it('should show "+X more" when there are more than 3 tags', () => {
    const propsWithManyTags = {
      ...mockProps,
      tags: ['education', 'health', 'housing', 'emergency', 'youth'],
    }
    renderWithProviders(<ResourceCard {...propsWithManyTags} />)

    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('should render tribe information when provided', () => {
    const propsWithTribe = {
      ...mockProps,
      tribe: {
        id: 'tribe-1',
        name: 'Example Tribe',
      },
    }
    renderWithProviders(<ResourceCard {...propsWithTribe} />)

    expect(screen.getByText('Example Tribe')).toBeInTheDocument()
    const tribeLink = screen.getByText('Example Tribe').closest('a')
    expect(tribeLink).toHaveAttribute('href', '/tribes/tribe-1')
  })

  it('should not render tribe section when tribe is not provided', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    expect(screen.queryByRole('link', { name: /tribe/i })).not.toBeInTheDocument()
  })

  it('should render "View Details" link', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    const detailsLink = screen.getByText('View Details').closest('a')
    expect(detailsLink).toHaveAttribute('href', '/resources/1')
  })

  it('should render "Visit Website" link when url is provided', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    const websiteLink = screen.getByText('Visit Website').closest('a')
    expect(websiteLink).toHaveAttribute('href', 'https://example.com')
    expect(websiteLink).toHaveAttribute('target', '_blank')
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should not render "Visit Website" link when url is not provided', () => {
    const propsWithoutUrl = {
      ...mockProps,
      url: null,
    }
    renderWithProviders(<ResourceCard {...propsWithoutUrl} />)

    expect(screen.queryByText('Visit Website')).not.toBeInTheDocument()
  })

  it('should not render state badge when state is not provided', () => {
    const propsWithoutState = {
      ...mockProps,
      state: null,
    }
    renderWithProviders(<ResourceCard {...propsWithoutState} />)

    expect(screen.queryByText('CA')).not.toBeInTheDocument()
  })

  it('should render SaveButton component', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    expect(screen.getByTestId('save-button')).toBeInTheDocument()
  })

  it('should render ShareButton component', () => {
    renderWithProviders(<ResourceCard {...mockProps} />)

    expect(screen.getByTestId('share-button')).toBeInTheDocument()
  })

  it('should handle long descriptions gracefully', () => {
    const propsWithLongDescription = {
      ...mockProps,
      description:
        'This is a very long description that should be truncated to three lines using the line-clamp utility class to prevent the card from becoming too tall and maintain a consistent layout across the grid.',
    }
    renderWithProviders(<ResourceCard {...propsWithLongDescription} />)

    expect(
      screen.getByText(/This is a very long description/)
    ).toBeInTheDocument()
  })

  it('should handle long titles gracefully', () => {
    const propsWithLongTitle = {
      ...mockProps,
      title:
        'This is a very long title that should be truncated to two lines to maintain card consistency',
    }
    renderWithProviders(<ResourceCard {...propsWithLongTitle} />)

    expect(
      screen.getByText(/This is a very long title/)
    ).toBeInTheDocument()
  })

  it('should render with minimal props', () => {
    const minimalProps = {
      id: '1',
      title: 'Minimal Resource',
      description: 'Minimal description',
      type: 'tribal',
      tags: [],
    }
    renderWithProviders(<ResourceCard {...minimalProps} />)

    expect(screen.getByText('Minimal Resource')).toBeInTheDocument()
    expect(screen.getByText('Minimal description')).toBeInTheDocument()
    expect(screen.getByText('tribal')).toBeInTheDocument()
  })
})
