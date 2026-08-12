'use client';

import { FormProps } from '#/interfaces';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';

import { usePage } from './usePage';

export const UserForm = (props: FormProps) => {
  const { form } = usePage(props);

  return (
    <div className="ml-8 mt-24 min-h-screen">
      <Form {...{ form, className: 'flex flex-col gap-4 ' }}>
        <Input name="name" />
        <Input name="email" />

        <div className="flex gap-4">
          <Button variant="tertiary" type="link" href={`/users`}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
