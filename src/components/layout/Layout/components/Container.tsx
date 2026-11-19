import { cn } from '@/lib/utils/cn';

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

// Jeden kontener dla nawigacji, treści i stopki, żeby ich krawędzie się
// pokrywały. Boczny odstęp jest na każdej szerokości — wcześniej lg:px-0
// przyklejał treść do krawędzi ekranu tuż nad progiem 1024px.
export const Container = ({ children, className }: ContainerProps) => (
  <div className={cn('mx-auto w-full max-w-(--breakpoint-lg) px-5 sm:px-8', className)}>
    {children}
  </div>
);
