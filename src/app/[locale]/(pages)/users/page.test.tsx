import { waitFor } from '@testing-library/react';
import { render, screen } from '#/tests/test-utils';
//import userEvent from '@testing-library/user-event';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Example from './page';

jest.mock('@/hooks/api/useApiQuery');

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('Example component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    render(<Example />);
    await waitFor(() => {
      expect(screen.queryByText('delectus aut autem')).not.toBeInTheDocument();
    });
  });

  it('displays error message when there is an error', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' }
    });

    render(<Example />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('displays data when fetch is successful', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Jan Kowalski',
          email: 'jan@example.com'
        }
      ],
      isLoading: false,
      error: null
    });

    render(<Example />);

    await waitFor(() => {
      expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    });
  });
});
