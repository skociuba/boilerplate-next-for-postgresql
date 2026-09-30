import { FormikValues } from 'formik';

import { UseApiMutationProps } from '@/hooks/api/useApiMutation';

export type User = {
  id?: string;
  name?: string;
  email?: string;
};

export type Users = User[];

export type Tag = {
  id?: string;
  name?: string;
  posts_count?: number;
};

export type Tags = Tag[];

export type Post = {
  id?: string;
  user_id?: string;
  author_id?: string;
  author_name?: string;
  title?: string;
  content?: string;
  created_at?: string;
  tags?: Tag[];
};

export type Posts = Post[];

export type UserProfile = {
  user_id?: string;
  pesel?: string;
  date_of_birth?: string;
  phone?: string;
};

export type FormProps = {
  oldValues?: FormikValues;
  // opcjonalny arg: id świeżo utworzonego zasobu — np. strona dodawania
  // posta przekierowuje nim od razu do edycji, żeby dodać tagi
  handleSubmit: (createdId?: string) => void;
  handleClose?: () => void;
} & UseApiMutationProps;
