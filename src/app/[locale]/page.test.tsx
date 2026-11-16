import { act, fireEvent, render, screen } from '#/tests/test-utils';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

// Strona główna to feed postów z API (HomeComponent → useApiQuery 'POSTS' +
// 'TAGS' do filtra) — mockujemy hook, żeby test nie strzelał do backendu i
// sprawdzał to, co realnie widzi użytkownik.
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

const post = {
  id: '1',
  title: 'Pierwszy post',
  content: longContent,
  author_id: '1',
  author_name: 'Ala',
  created_at: '2026-11-01T10:00:00Z',
  tags: [{ id: '1', name: 'news' }]
};

const tags = [
  { id: 1, name: 'news', posts_count: 12 },
  { id: 2, name: 'pusty', posts_count: 0 }
];

// Odpowiada kształtowi GET /posts: { items, pagination }
const mockApi = ({
  items = [post],
  total
}: { items?: (typeof post & { image_url?: string })[]; total?: number } = {}) => {
  (useApiQuery as jest.Mock).mockImplementation(({ route }: { route: string }) =>
    route === 'TAGS'
      ? { data: tags, isLoading: false }
      : {
          data: { items, pagination: { page: 1, limit: 9, total: total ?? items.length } },
          isLoading: false,
          isFetching: false
        }
  );
};

// values przekazane w ostatnim zapytaniu o posty — tak sprawdzamy, co
// faktycznie poleciałoby do API
const lastPostsQuery = () =>
  (useApiQuery as jest.Mock).mock.calls.filter(([props]) => props.route === 'POSTS').at(-1)?.[0]
    .values;

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a card for every post', async () => {
    mockApi();

    render(<Page />);

    // HomeComponent jest ładowany przez next/dynamic, stąd find* (czeka na
    // dociągnięcie modułu), a nie get*.
    expect(await screen.findByRole('button', { name: /Pierwszy post/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Najnowsze posty' })).toBeInTheDocument();
    expect(screen.getByText('1 post')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the full post in a dialog and closes it', async () => {
    mockApi();

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
    mockApi();

    render(<Page />);
    fireEvent.click(await screen.findByRole('button', { name: /Pierwszy post/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Zamknij' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the post image in the card and between title and content in the dialog', async () => {
    mockApi({ items: [{ ...post, image_url: '/uploads/posts/zdjecie.png' }] });

    render(<Page />);
    const card = await screen.findByRole('button', { name: /Pierwszy post/ });

    expect(card.querySelector('img[src$="/uploads/posts/zdjecie.png"]')).toBeInTheDocument();

    fireEvent.click(card);
    const dialogImage = screen
      .getByRole('dialog')
      .querySelector('img[src$="/uploads/posts/zdjecie.png"]');

    expect(dialogImage).toBeInTheDocument();
    // kolejność w DOM: zdjęcie przed treścią
    const content = screen.getByRole('dialog').querySelector('p.whitespace-pre-line');
    expect(
      dialogImage!.compareDocumentPosition(content!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('renders no image when the post has none', async () => {
    mockApi();

    render(<Page />);
    const card = await screen.findByRole('button', { name: /Pierwszy post/ });

    expect(card.querySelector('img[src*="/uploads/posts/"]')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no posts', async () => {
    mockApi({ items: [] });

    render(<Page />);

    expect(await screen.findByText(/Brak postów/)).toBeInTheDocument();
  });

  it('sends the tag and sort to the API and offers only tags that have posts', async () => {
    mockApi();

    render(<Page />);
    const tagSelect = await screen.findByRole('combobox', { name: 'Filtruj po tagu' });

    expect(screen.queryByRole('option', { name: /pusty/ })).not.toBeInTheDocument();

    fireEvent.change(tagSelect, { target: { value: '1' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Sortowanie' }), {
      target: { value: 'title:asc' }
    });

    expect(lastPostsQuery()).toEqual(
      expect.objectContaining({ tagId: '1', sortBy: 'title', order: 'asc', page: 1 })
    );
    expect(screen.getByRole('button', { name: 'Wyczyść filtry' })).toBeInTheDocument();
  });

  it('debounces the search before querying', async () => {
    jest.useFakeTimers();
    mockApi();

    render(<Page />);
    fireEvent.change(await screen.findByRole('searchbox'), { target: { value: '  prisma ' } });

    expect(lastPostsQuery()).toEqual(expect.objectContaining({ q: '' }));

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(lastPostsQuery()).toEqual(expect.objectContaining({ q: 'prisma', page: 1 }));
    jest.useRealTimers();
  });

  it('paginates when there are more posts than fit on one page', async () => {
    mockApi({ total: 20 });

    render(<Page />);
    fireEvent.click(await screen.findByRole('button', { name: 'strona 2' }));

    expect(lastPostsQuery()).toEqual(expect.objectContaining({ page: 2, limit: 9 }));
  });
});
