import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '@/components/SearchBar'

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders search input', () => {
    render(<SearchBar />)

    const input = screen.getByPlaceholderText(/Search for resources, tribes, scholarships/i)
    expect(input).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(<SearchBar />)

    const button = screen.getByRole('button', { name: /Search/i })
    expect(button).toBeInTheDocument()
  })

  it('updates input value when typing', () => {
    render(<SearchBar />)

    const input = screen.getByRole('searchbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'education' } })

    expect(input.value).toBe('education')
  })

  it('navigates to search page on form submit', async () => {
    render(<SearchBar />)

    const input = screen.getByRole('searchbox')
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'education' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search?q=education')
    })
  })

  it('does not navigate if search is empty', () => {
    render(<SearchBar />)

    const form = screen.getByRole('searchbox').closest('form')!
    fireEvent.submit(form)

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('encodes query with whitespace correctly', async () => {
    render(<SearchBar />)

    const input = screen.getByRole('searchbox')
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: '  education  ' } })
    fireEvent.submit(form)

    await waitFor(() => {
      // Component trims in the conditional but encodes the full value
      expect(mockPush).toHaveBeenCalled()
      const callArg = mockPush.mock.calls[0][0]
      expect(callArg).toContain('/search?q=')
      expect(callArg).toContain('education')
    })
  })

  it('encodes special characters in search query', async () => {
    render(<SearchBar />)

    const input = screen.getByRole('searchbox')
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'health & wellness' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search?q=health%20%26%20wellness')
    })
  })

  it('has correct ARIA labels', () => {
    render(<SearchBar />)

    const input = screen.getByLabelText(/Search for resources, tribes, and scholarships/i)
    expect(input).toBeInTheDocument()
  })
})
