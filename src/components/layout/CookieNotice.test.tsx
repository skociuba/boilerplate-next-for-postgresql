import { fireEvent, render, screen } from '#/tests/test-utils';

import { COOKIE_NOTICE_KEY, CookieNotice } from './CookieNotice';

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

describe('CookieNotice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the notice with a link to the privacy policy', async () => {
    render(<CookieNotice />);

    expect(await screen.findByRole('region', { name: /cookie/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Szczegóły' })).toHaveAttribute('href', '/privacy');
  });

  it('hides the notice and remembers it after "Rozumiem"', async () => {
    render(<CookieNotice />);
    fireEvent.click(await screen.findByRole('button', { name: 'Rozumiem' }));

    expect(screen.queryByRole('region', { name: /cookie/i })).not.toBeInTheDocument();
    expect(localStorage.getItem(COOKIE_NOTICE_KEY)).toBe('1');
  });

  it('stays hidden for someone who already closed it', () => {
    localStorage.setItem(COOKIE_NOTICE_KEY, '1');

    render(<CookieNotice />);

    expect(screen.queryByRole('region', { name: /cookie/i })).not.toBeInTheDocument();
  });
});
