// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind 4 nie ma tailwind.config.js — plugin czyta motyw (własne
  // kolory, rounded-xs) z arkusza, żeby sortować klasy tak jak Tailwind
  tailwindStylesheet: './src/app/[locale]/styles/globals.css',
  tailwindFunctions: ['clsx', 'cn', 'twMerge']
};
