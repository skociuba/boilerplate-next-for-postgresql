import ReactQueryProvider from '@/providers/ReactQueryProvider';

import { render, RenderOptions } from '@testing-library/react';
import messages from '#/../messages/en.json';
import { NextIntlClientProvider } from 'next-intl';
import { ReactElement } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

type ProvidersProps = {
  readonly children?: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ReactQueryProvider>
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
