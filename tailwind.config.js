/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)']
      },
      // navy/cloud używane w całym projekcie (Button, Input, LoginForm...)
      // od zawsze, ale NIGDZIE nie były zdefiniowane — Tailwind po cichu
      // nie generował dla nich żadnej klasy (nieznany kolor = brak reguły
      // CSS), więc np. "text-navy"/"border-cloud" nic nie stylowały.
      // Sprawdzone: grep przez cały repo nie znalazł definicji nigdzie.
      colors: {
        navy: '#1b2a4a',
        cloud: '#d9dee6',
        // Ta sama historia co navy/cloud: "text-gray" (Intro, Breakpoints)
        // i "border-error" (Input z błędem walidacji) nie miały definicji,
        // więc pole z błędem w ogóle nie robiło się czerwone. DEFAULT
        // dokłada samo "gray" — skala gray-50…900 zostaje (extend scala).
        gray: { DEFAULT: '#6b7280' },
        error: '#b91c1c'
      },
      // "rounded-xs" jest w Button/Input od początku, ale to klasa z
      // Tailwinda 4 — w 3.4 nie istnieje, więc wszystko było kanciaste.
      borderRadius: {
        xs: '6px'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwind-scrollbar')]
};
