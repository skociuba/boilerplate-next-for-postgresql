'use client';

import { FormProps } from '#/interfaces';

import { Button } from '@/ui/Button';
import { Form } from '@/ui/Form';
import Input from '@/ui/Input';
import { RoleSelect } from '@/ui/RoleSelect';

import { usePage } from './usePage';

export const UserForm = (props: FormProps) => {
  const { form } = usePage(props);

  return (
    <div className="w-full max-w-2xl">
      <Form {...{ form, className: 'flex flex-col gap-4' }}>
        <Input name="name" />
        <Input name="email" />
        <RoleSelect />

        <div className="flex flex-wrap gap-4">
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
