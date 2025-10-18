import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navigation from '../Navigation'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
}))

describe('Navigation', () => {
  const mockedUseSession = useSession as jest.Mock
  const mockedSignOut = signOut as jest.Mock
  const mockedUsePathname = usePathname as jest.Mock

  beforeEach(() => {
    mockedUseSession.mockReturnValue({ data: { user: { name: 'Usuário Teste' } } })
    mockedUsePathname.mockReturnValue('/dashboard')
    mockedSignOut.mockReset()
  })

  it('destaca o link ativo baseado no pathname atual', () => {
    render(<Navigation />)

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboardLink).toHaveClass('bg-blue-100')
  })

  it('realiza o signOut quando o botão Sair é clicado', async () => {
    const user = userEvent.setup()
    render(<Navigation />)

    await user.click(screen.getByRole('button', { name: /sair/i }))

    expect(mockedSignOut).toHaveBeenCalledTimes(1)
  })
})
