// Nagłówki bezpieczeństwa stron, ustawiane w middleware.js.
//
// Wyjątek: samo /vps2 (strona główna przy basePath, którą next-intl
// przepisuje na /vps2/pl). Next gubi tam nagłówki — zarówno z headers() w
// next.config, jak i ustawione w middleware — więc dla tego jednego adresu
// dokłada je nginx (ansible/roles/nginx/templates/project.conf.j2,
// location = /vps2). Zmiana tutaj = zmiana tam.
//
// CSP jest celowo częściowa: Next.js wstrzykuje skrypty inline, więc
// ograniczenie script-src wymagałoby nonce'ów generowanych na każde żądanie.
// To, co tu jest, niczego nie psuje, a zamyka konkretne wektory: osadzenie
// strony w cudzej ramce (clickjacking), podmianę <base>, wysłanie
// formularza na obcy adres i wtyczki (<object>/<embed>).
export const securityHeaders = {
  'Content-Security-Policy':
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  // To samo co frame-ancestors, dla przeglądarek bez CSP poziomu 2
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  // Obce strony dostają w Referer tylko domenę, bez ścieżki i parametrów
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Aplikacja nie używa kamery, mikrofonu ani lokalizacji — nawet skrypt
  // wstrzyknięty przez XSS nie poprosi o nie użytkownika
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
};
