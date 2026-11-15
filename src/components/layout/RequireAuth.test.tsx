import { render, screen, waitFor } from '#/tests/test-utils';

import { fetchRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

import { RequireAuth } from './RequireAuth';

// Testy stron (users, users/edit) zastępują RequireAuth atrapą, więc to
// tutaj sprawdzamy, że strażnik faktycznie nie wpuszcza: bez sesji → /login,
// zła rola → /, sesja odrzucona przez API → /login.
const mockReplace = jest.fn();
jest.mock('#/navigation', () => ({
  useRouter: () => ({ replace: mockReplace })
}));

jest.mock('@/lib/api', () => ({
  fetchRequest: jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: jest.fn()
}));

const admin = { id: 1, name: 'Anna', email: 'anna@example.com', role: 'admin' as const };
const user = { ...admin, role: 'user' as const };

const renderGuard = (adminOnly = false) =>
  render(
    <RequireAuth adminOnly={adminOnly}>
      <p>tajna treść</p>
    </RequireAuth>
  );

describe('RequireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, hasHydrated: true });
  });

  it('redirects to /login when nobody is logged in', async () => {
    renderGuard();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    expect(fetchRequest).not.toHaveBeenCalled();
    expect(screen.queryByText('tajna treść')).not.toBeInTheDocument();
  });

  it('redirects a non-admin to / on an admin-only page', async () => {
    useAuthStore.setState({ user });

    renderGuard(true);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
    expect(screen.queryByText('tajna treść')).not.toBeInTheDocument();
  });

  it('redirects to /login when the API rejects the session', async () => {
    useAuthStore.setState({ user });
    (fetchRequest as jest.Mock).mockResolvedValue({ error: 'Unauthorized' });

    renderGuard();

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('tajna treść')).not.toBeInTheDocument();
  });

  it('renders the page once /auth/me confirms the session', async () => {
    useAuthStore.setState({ user: admin });
    (fetchRequest as jest.Mock).mockResolvedValue({ data: admin });

    renderGuard(true);

    expect(await screen.findByText('tajna treść')).toBeInTheDocument();
    expect(fetchRequest).toHaveBeenCalledWith({ route: 'AUTH_ME', method: 'GET' });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
