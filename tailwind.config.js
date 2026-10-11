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
        cloud: '#d9dee6'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwind-scrollbar')]
};
