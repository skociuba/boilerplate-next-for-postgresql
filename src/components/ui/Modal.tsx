'use client';

import { X } from 'lucide-react';
import { ReactNode, useEffect, useId, useRef } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
};

// Własny dialog zamiast natywnego <dialog>: jsdom (testy) nie ma
// showModal(), a potrzebne zachowania są proste do zrobienia ręcznie:
// Esc i klik w tło zamykają, strona pod spodem się nie przewija, fokus
// wchodzi do okna i wraca na kafel, z którego okno otwarto.
export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-6"
      onMouseDown={(event) => {
        // tylko klik w samo tło — zaznaczanie tekstu w oknie i puszczenie
        // myszy poza nim nie powinno zamykać
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold leading-snug text-slate-900">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="-mr-2 shrink-0 rounded-xs p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};
