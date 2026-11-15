import { fireEvent, render, screen } from '#/tests/test-utils';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

// Strona główna to feed postów z API (HomeComponent → useApiQuery 'POSTS')
// — mockujemy hook, żeby test nie strzelał do backendu i sprawdzał to, co
// realnie widzi użytkownik.
jest.mock('@/hooks/api/useApiQuery');

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

const longContent =
  'Pierwsze zdanie posta. Czytaj więcej na https://example.com/artykul i daj znać, co myślisz.';

const posts = [
  {
    id: '1',
    title: 'Pierwszy post',
    content: longContent,
    author_id: '1',
    author_name: 'Ala',
    created_at: '2026-11-01T10:00:00Z',
    tags: [{ id: '1', name: 'news' }]
  }
];

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a card for every post', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: posts, isLoading: false, error: null });

    render(<Page />);

    // HomeComponent jest ładowany przez next/dynamic, stąd find* (czeka na
    // dociągnięcie modułu), a nie get*.
    expect(await screen.findByRole('button', { name: /Pierwszy post/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Najnowsze posty' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the full post in a dialog and closes it', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: posts, isLoading: false, error: null });

    render(<Page />);
    fireEvent.click(await screen.findByRole('button', { name: /Pierwszy post/ }));

    const dialog = screen.getByRole('dialog', { name: 'Pierwszy post' });
    expect(dialog).toHaveTextContent('daj znać, co myślisz');
    // Link z treści jest klikalny w pełnym widoku
    expect(screen.getByRole('link', { name: 'https://example.com/artykul' })).toHaveAttribute(
      'href',
      'https://example.com/artykul'
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the dialog with the close button', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: posts, isLoading: false, error: null });

    render(<Page />);
    fireEvent.click(await screen.findByRole('button', { name: /Pierwszy post/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Zamknij' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no posts', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });

    render(<Page />);

    expect(await screen.findByText(/Brak postów/)).toBeInTheDocument();
  });
});
