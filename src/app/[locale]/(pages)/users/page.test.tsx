import { render, screen } from '#/tests/test-utils';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

jest.mock('@/hooks/api/useApiQuery');

// Strona jest za RequireAuth adminOnly, który renderuje dzieci dopiero po
// GET /auth/me. Tu testujemy treść strony widzianą przez zalogowanego
// admina — samego strażnika testuje RequireAuth.test.tsx.
jest.mock('@/components/layout/RequireAuth', () => ({
  RequireAuth: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('Users page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render the list while loading', () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });

    render(<Page />);

    expect(screen.queryByText('dodaj użytkownika')).not.toBeInTheDocument();
  });

  it('displays the error message from the API', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' }
    });

    render(<Page />);

    expect(await screen.findByText('Failed to fetch')).toBeInTheDocument();
  });

  it('displays users and marks admins', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: [
        { id: '1', name: 'Jan Kowalski', email: 'jan@example.com', role: 'user' },
        { id: '2', name: 'Anna Admin', email: 'anna@example.com', role: 'admin' }
      ],
      isLoading: false,
      error: null
    });

    render(<Page />);

    expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Admin')).toBeInTheDocument();
    // Plakietka "admin" tylko przy Annie
    expect(screen.getAllByText('admin')).toHaveLength(1);
  });
});
