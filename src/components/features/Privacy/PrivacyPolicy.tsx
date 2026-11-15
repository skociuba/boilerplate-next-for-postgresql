// Treść odpowiada temu, co aplikacja faktycznie robi (sprawdzone w kodzie
// backendu i frontendu): jakie pola zapisuje baza, jakie cookie ustawia
// backend, co trzyma localStorage. Zmiana w tych miejscach = zmiana tutaj.
export const CONTROLLER_NAME = 'Sebastian Kociuba';
export const CONTACT_EMAIL = 'skociuba.noreply@gmail.com';

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
      wszystko przetestować, ale nie wpisuj prawdziwego numeru PESEL, skanów dokumentów ani danych
      swoich dzieci — używaj danych wymyślonych.
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
          <strong>Konto:</strong> imię, adres email i hasło. Hasła nie przechowujemy — zapisujemy
          tylko jego skrót (bcrypt), z którego nie da się odtworzyć hasła.
        </li>
        <li>
          <strong>Profil (opcjonalnie):</strong> PESEL, data urodzenia, telefon, opis, zdjęcie
          profilowe i przesłany dokument.
        </li>
        <li>
          <strong>Treści, które dodajesz:</strong> posty, tagi oraz wpisy w module „Dzieci” (imię,
          wiek, data urodzenia, notatki).
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
        reklam ani skryptów firm trzecich, dlatego nie prosimy o zgodę — te pliki są niezbędne do
        działania serwisu.
      </p>
      <div className="overflow-x-auto rounded-xs border border-slate-200">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 font-medium">Nazwa</th>
              <th className="px-3 py-2 font-medium">Rodzaj</th>
              <th className="px-3 py-2 font-medium">Po co</th>
              <th className="px-3 py-2 font-medium">Jak długo</th>
            </tr>
          </thead>
          <tbody>
            {STORAGE_ROWS.map((row) => (
              <tr key={row.name} className="border-t border-slate-200 align-top">
                <td className="px-3 py-2 font-mono text-xs">{row.name}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">{row.purpose}</td>
                <td className="px-3 py-2">{row.lifetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  </article>
);
