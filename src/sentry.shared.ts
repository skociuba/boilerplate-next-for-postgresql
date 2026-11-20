// Ustawienia Sentry wspólne dla przeglądarki, serwera Node i edge
// (instrumentation-client.ts, instrumentation.ts). Sentry łapie
// nieoczekiwane błędy — w przeglądarce użytkownika i przy renderowaniu na
// serwerze — z wersją wydania, a przy nowym błędzie przychodzi mail.
// Bez tego o białej stronie po wyjątku w komponencie wiedzielibyśmy dopiero
// od użytkownika: backend widzi wtedy zwykłe "200 OK".
//
// DSN jest wpisywany w obraz przy buildzie (build-arg w CI, zmienna repo
// NEXT_PUBLIC_SENTRY_DSN). Bez niego — lokalnie, w testach, w E2E — Sentry
// się nie włącza.
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: 'production',
  // Tylko błędy: bez pomiaru wydajności (tracing) i bez nagrywania sesji
  // (replay) — przy tym ruchu niewiele by pokazały, a replay to nagranie
  // tego, co użytkownik robi na stronie
  tracesSampleRate: 0,
  // Sentry 11 domyślnie zbiera ciastka, nagłówki i ciała żądań. Do
  // zdiagnozowania błędu wystarczy stack trace, adres i przeglądarka.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: []
  }
};
