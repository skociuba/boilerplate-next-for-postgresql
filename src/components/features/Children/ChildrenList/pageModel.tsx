// Filtry (name/minAge/maxAge) — wszystkie opcjonalne, więc bez
// validationSchema; sam fakt pustego stringa = "brak filtra" (patrz
// backend: childController.ts, ten sam kontrakt).
export const filterInitialValues = {
  name: '',
  minAge: '',
  maxAge: ''
};
