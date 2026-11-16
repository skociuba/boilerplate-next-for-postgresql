// Treść odpowiada temu, co aplikacja faktycznie robi (sprawdzone w kodzie
// backendu i frontendu): jakie pola zapisuje baza, jakie cookie ustawia
// backend, co trzyma localStorage. Zmiana w tych miejscach = zmiana tutaj.
export const CONTROLLER_NAME = 'Sebastian Kociuba';
export const CONTACT_EMAIL = 'skociuba.noreply@gmail.com';
// Zmieniasz treść = zmieniasz datę; użytkownik powinien widzieć, od kiedy
// obowiązuje wersja, którą czyta.
const LAST_UPDATED = '16 listopada 2026';

const STORAGE_ROWS = [
  {
    name: 'refresh_token',
    type: 'cookie (httpOnly)',
    purpose: 'utrzymanie sesji po zalogowaniu; niedostępne dla skryptów na stronie',
    lifetime: '7 dni albo do wylogowania'
  },
  {
    name: 'current_user',
    type: 'localStorage',
    purpose: 'imię, email i rola zalogowanej osoby, żeby interfejs wiedział, kto jest zalogowany',
    lifetime: 'do wylogowania'
  },
  {
    name: 'cookie_notice_ack',
    type: 'localStorage',
    purpose: 'zapamiętanie, że komunikat o cookies został zamknięty',
    lifetime: 'do wyczyszczenia danych przeglądarki'
  }
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <div className="flex flex-col gap-3 leading-relaxed text-slate-700">{children}</div>
  </section>
);

export const PrivacyPolicy = () => (
  <article className="flex max-w-3xl flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
    <div className="rounded-xs border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>To aplikacja demonstracyjna (projekt portfolio).</strong> Możesz założyć konto i
      wszystko przetestować, ale nie przesyłaj skanów prawdziwych dokumentów — do testów wystarczy
      dowolny plik.
    </div>

    <Section title="Kto odpowiada za Twoje dane">
      <p>
        Administratorem danych jest {CONTROLLER_NAME}. W sprawach danych osobowych napisz na{' '}
        <a className="text-navy underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </Section>

    <Section title="Jakie dane zbieramy">
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Konto:</strong> imię i nazwisko, adres email i hasło. Hasła nie przechowujemy —
          zapisujemy tylko jego skrót (bcrypt), z którego nie da się odtworzyć hasła.
        </li>
        <li>
          <strong>Profil (wszystko opcjonalne):</strong> data urodzenia, telefon, zdjęcie profilowe
          i przesłany dokument. Nie zbieramy numeru PESEL ani innych numerów identyfikacyjnych.
        </li>
        <li>
          <strong>Treści, które dodajesz:</strong> posty i tagi. Posty, Twoje imię i nazwisko oraz
          zdjęcie profilowe są widoczne publicznie na stronie głównej.
        </li>
        <li>
          <strong>Dane techniczne:</strong> adres IP — używany na bieżąco do ograniczania liczby
          prób logowania i rejestracji oraz zapisywany w logach serwera.
        </li>
      </ul>
    </Section>

    <Section title="Po co i na jakiej podstawie">
      <p>
        Dane konta i profilu przetwarzamy, żeby prowadzić Twoje konto i udostępniać funkcje
        aplikacji (art. 6 ust. 1 lit. b RODO). Adres IP i logi — żeby chronić aplikację przed
        nadużyciami, np. zgadywaniem haseł (art. 6 ust. 1 lit. f RODO).
      </p>
    </Section>

    <Section title="Komu przekazujemy dane">
      <ul className="list-disc space-y-1 pl-5">
        <li>dostawcy serwera VPS, na którym działa aplikacja i baza danych,</li>
        <li>
          Google (Gmail) — przez skrzynkę Gmail wysyłamy maile aktywacyjne i maile do resetu hasła.
        </li>
      </ul>
      <p>Nie sprzedajemy danych i nie używamy ich do reklam.</p>
    </Section>

    <Section title="Jak długo">
      <p>
        Dane konta przechowujemy do jego usunięcia. Link aktywacyjny jest ważny 24 godziny, link do
        resetu hasła — godzinę, sesja po zalogowaniu — 7 dni.
      </p>
    </Section>

    <Section title="Twoje prawa">
      <p>
        Masz prawo dostępu do swoich danych, ich poprawienia, usunięcia, ograniczenia przetwarzania,
        przeniesienia oraz sprzeciwu. Żeby usunąć konto albo skorzystać z innego prawa, napisz na
        adres podany wyżej. Możesz też złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
      </p>
    </Section>

    <Section title="Cookies i pamięć przeglądarki">
      <p>
        Zapisujemy w przeglądarce tylko to, bez czego logowanie nie działa. Nie używamy analityki,
        reklam, pikseli śledzących ani skryptów firm trzecich (także fontów — ładujemy je z naszego
        serwera), dlatego nie prosimy o zgodę — przepisy wymagają jej dla plików, które nie są
        niezbędne do działania serwisu, a takich tu nie ma.
      </p>
      {/* Lista kart zamiast tabeli: tabela z 4 kolumnami na telefonie albo
          się ściska do nieczytelności, albo przewija w bok. */}
      <ul className="flex flex-col gap-3">
        {STORAGE_ROWS.map((row) => (
          <li key={row.name} className="rounded-xs border border-slate-200 p-4 text-sm">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <code className="font-mono font-semibold text-slate-900">{row.name}</code>
              <span className="text-xs text-slate-500">{row.type}</span>
            </p>
            <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[max-content_1fr]">
              <dt className="text-slate-500">Po co</dt>
              <dd>{row.purpose}</dd>
              <dt className="text-slate-500">Jak długo</dt>
              <dd>{row.lifetime}</dd>
            </dl>
          </li>
        ))}
      </ul>
      <p>
        Możesz je w każdej chwili usunąć w ustawieniach przeglądarki — wylogujesz się wtedy, ale nic
        więcej się nie zepsuje. Wylogowanie samo usuwa sesję i dane zalogowanej osoby.
      </p>
    </Section>

    <p className="text-sm text-slate-500">Ostatnia aktualizacja: {LAST_UPDATED}</p>
  </article>
);
