import createMiddleware from 'next-intl/middleware';

import { routing } from './navigation';

// Języki, domyślny locale i brak autodetekcji — wszystko w routing
// (src/navigation.js)
export default createMiddleware(routing);

export const config = {
  // Ten matcher wyłapuje wszystko poza plikami statycznymi, api i _next
  matcher: [
    // Dopasuj wszystkie ścieżki, które powinny być zlokalizowane
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Opcjonalnie: dopasuj stronę główną
    '/'
  ]
};
