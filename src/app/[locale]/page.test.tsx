import { render, screen } from '#/tests/test-utils';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

// Strona główna to teraz feed postów z API (HomeComponent → useApiQuery
// 'POSTS'), a nie statyczny tekst z tłumaczeń — mockujemy hook, żeby test
// nie strzelał do backendu i sprawdzał to, co realnie widzi użytkownik.
jest.mock('@/hooks/api/useApiQuery');

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders posts from the API', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: '1',
          title: 'Pierwszy post',
          content: 'Treść posta',
          author_id: '1',
          author_name: 'Ala',
          created_at: '2026-11-01T10:00:00Z',
          tags: [{ id: '1', name: 'news' }]
        }
      ],
      isLoading: false,
      error: null
    });

    render(<Page />);

    // HomeComponent i Intro są ładowane przez next/dynamic, stąd find*
    // (czeka na dociągnięcie modułu), a nie get*.
    expect(await screen.findByText('Pierwszy post')).toBeInTheDocument();
    expect(screen.getByText('Treść posta')).toBeInTheDocument();
    // Tytuł strony (layout.homePage.title) i okruszek (breakpoints) mają ten
    // sam tekst, więc są dwa trafienia.
    expect((await screen.findAllByText('Main Page')).length).toBeGreaterThan(0);
  });

  it('shows the empty state when there are no posts', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });

    render(<Page />);

    expect(await screen.findByText(/Brak postów/)).toBeInTheDocument();
  });
});
