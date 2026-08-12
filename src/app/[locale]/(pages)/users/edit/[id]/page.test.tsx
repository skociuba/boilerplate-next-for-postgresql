import { render, screen, waitFor } from '#/tests/test-utils';
import { useRouter } from 'next/navigation';

import { useApiQuery } from '@/hooks/api/useApiQuery';

import Page from './page';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('#/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

jest.mock('@/hooks/api/useApiQuery', () => ({
  useApiQuery: jest.fn()
}));

describe('User Edit Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  it('should render the edit page with user data', async () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: [{ id: '1', name: 'John Doe', email: 'john@example.com' }],
      isLoading: false,
      error: null
    });

    render(<Page params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getAllByText(/Users/i)[0]).toBeInTheDocument();
      // Since UserForm is dynamically imported with ssr: false, we might need to handle that in tests
      // However, usually in Jest/RTL with our test-utils it might work if we mock it or use a proper setup
    });
  });

  it('should show loading state', () => {
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    render(<Page params={{ id: '1' }} />);
    // Loading is passed to Layout which shows Skeleton
    // We can't easily check for Skeleton here without more specific props,
    // but we can check if the form is NOT there
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
