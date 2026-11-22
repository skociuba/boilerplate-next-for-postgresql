import createMiddleware from 'next-intl/middleware';

import { routing } from './navigation';
import { securityHeaders } from './securityHeaders';

// Języki, domyślny locale i brak autodetekcji — wszystko w routing
// (src/navigation.js)
const intlMiddleware = createMiddleware(routing);

// Każda strona przechodzi przez ten middleware (matcher niżej), więc to
// jedno miejsce na nagłówki bezpieczeństwa — także dla strony głównej
export default function middleware(request) {
  const response = intlMiddleware(request);
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }

  return response;
}

export const config = {
  // Wszystko poza plikami statycznymi, _next i /api... (w tym /api-proxy:
  // tam odpowiada backend z własnymi nagłówkami z helmet)
  matcher: [
    // Dopasuj wszystkie ścieżki, które powinny być zlokalizowane
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Strona główna
    '/'
  ]
};
