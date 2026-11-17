import { render, screen } from '#/tests/test-utils';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

jest.mock('@/hooks/api/useApiQuery', () => ({
  useApiQuery: jest.fn()
}));

// Jak w users/page.test.tsx: strażnika (RequireAuth) testujemy osobno,
// tutaj tylko to, co widzi admin po przejściu przez niego.
jest.mock('@/components/layout/RequireAuth', () => ({
  RequireAuth: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Strona bierze useRouter z #/navigation (next-intl, routing z locale),
// nie z next/navigation.
const mockPush = jest.fn();
jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({ push: mockPush }),
  usePathname: jest.fn()
}));

// Id z URL-a strona czyta przez useParams() (Next 15), nie z propsa
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({ id: '1' })
}));

describe('User Edit Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks the API for the user from the URL and renders the page', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: [{ id: '1', name: 'John Doe', email: 'john@example.com' }],
      isLoading: false,
      error: null
    });

    render(<Page />);

    expect(useApiQuery).toHaveBeenCalledWith({ route: 'USER', id: '1' });
    // Tytuł (layout.users.title) i okruszek "Users"
    expect((await screen.findAllByText('Users')).length).toBeGreaterThan(0);
    expect(await screen.findByText('Edit')).toBeInTheDocument();
    // Formularz (dynamic, ładowany asynchronicznie) z danymi z API —
    // czekanie na niego zamyka też jego ładowanie wewnątrz testu
    expect(await screen.findByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('does not render the form while loading', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });

    render(<Page />);

    // Najpierw poczekaj, aż strona skończy renderowanie (dynamic() ładuje
    // formularz asynchronicznie) — inaczej React 19 zgłasza aktualizację
    // poza act(), a brak pola mógłby znaczyć tylko "jeszcze się nie załadował"
    expect(await screen.findByText('Edit')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
