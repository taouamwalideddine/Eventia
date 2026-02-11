import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the NeonButton component since it uses properties that might not render easily in test environment without full context
jest.mock('@/components/ui/NeonButton', () => ({
    NeonButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))

// Mock GlassCard
jest.mock('@/components/ui/GlassCard', () => ({
    GlassCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Home', () => {
    it('renders correctly', () => {
        render(<Home />)
        expect(screen.getByText(/Unforgettable/i)).toBeInTheDocument()
    })
})
