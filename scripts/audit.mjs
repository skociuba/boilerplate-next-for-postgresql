// npm audit zależności produkcyjnych z listą świadomych wyjątków.
//
// Samo `npm audit --audit-level=high` nie pozwala pominąć jednej
// konkretnej podatności — a czasem łatki po prostu nie ma (np. picomatch
// w GHSA-fc5q-39xc-vjpf), więc jedyne wyjścia to obniżyć próg dla
// wszystkich albo wyjątek dla tej jednej. Ten skrypt robi to drugie:
// każdy wyjątek w audit-allowlist.json ma uzasadnienie i datę ważności,
// po której CI znowu zaczyna krzyczeć — żeby wyjątek nie został na zawsze.
//
// Uruchamiane w CI (ci.yml) i lokalnie: node scripts/audit.mjs

// Narzędzie CLI — wypisanie wyniku na konsolę to jego jedyne zadanie
/* eslint-disable no-console */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const BLOCKING = new Set(['high', 'critical']);

const allowlist = JSON.parse(readFileSync(new URL('../audit-allowlist.json', import.meta.url)));
const today = new Date().toISOString().slice(0, 10);

let raw;
try {
  raw = execFileSync('npm', ['audit', '--omit=dev', '--json'], { encoding: 'utf8' });
} catch (error) {
  // npm audit kończy się kodem != 0, gdy cokolwiek znajdzie — raport i
  // tak jest na stdout
  raw = error.stdout;
}
const report = JSON.parse(raw);

// W raporcie paczka może mieć w "via" obiekt (sama ma podatność) albo
// nazwę innej paczki (jest podatna, bo od niej zależy). Liczą się tylko
// obiekty — to są faktyczne advisories; reszta to ich skutki w drzewie.
const advisories = new Map();
for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via) {
    if (typeof via === 'object' && BLOCKING.has(via.severity)) {
      const id = via.url.split('/').pop();
      advisories.set(id, { id, title: via.title, pkg: via.name, severity: via.severity });
    }
  }
}

const problems = [];
for (const advisory of advisories.values()) {
  const entry = allowlist.find((a) => a.id === advisory.id);
  if (!entry) {
    problems.push(`${advisory.severity}: ${advisory.pkg} — ${advisory.title} (${advisory.id})`);
  } else if (entry.expires < today) {
    problems.push(`wyjątek ${advisory.id} wygasł ${entry.expires} — sprawdź, czy jest już łatka`);
  } else {
    console.log(
      `pominięte do ${entry.expires}: ${advisory.id} (${advisory.pkg}) — ${entry.reason}`
    );
  }
}

// Wyjątek, którego audyt już nie zgłasza (np. po aktualizacji), tylko
// zaśmieca listę — do usunięcia
for (const entry of allowlist) {
  if (!advisories.has(entry.id)) {
    console.log(`wyjątek ${entry.id} nie jest już potrzebny — usuń go z audit-allowlist.json`);
  }
}

if (problems.length) {
  console.error('Podatności HIGH/CRITICAL w zależnościach produkcyjnych:');
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log('Audyt OK: brak niezaakceptowanych podatności HIGH/CRITICAL.');
