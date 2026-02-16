import { FormikContextType, FormikProvider, FormikValues } from 'formik';
import { PropsWithChildren } from 'react';

export type FormType = {
  className?: string;
  form: FormikContextType<FormikValues>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Pick<any, 'children'> &
  PropsWithChildren;

export const Form = ({ children, className, form }: FormType) => (
  <FormikProvider value={form}>
    <form onSubmit={form.handleSubmit}>
      <fieldset disabled={form.isSubmitting} className={className}>
        {children}
      </fieldset>
    </form>
  </FormikProvider>
);
