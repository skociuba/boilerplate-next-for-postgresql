import { FormikValues } from 'formik';

import { UseApiMutationProps } from '@/hooks/api/useApiMutation';

export type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
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
  author_avatar_url?: string | null;
  image_url?: string | null;
  title?: string;
  content?: string;
  created_at?: string;
  tags?: Tag[];
};

export type Posts = Post[];

export type Child = {
  id?: number;
  user_id?: number;
  name?: string;
  age?: number;
  date_of_birth?: string;
  notes?: string;
};

export type Children = Child[];

// Kształt dokładnie taki jak GET /children w backendzie —
// zobacz Ściągawkę Query (childController.ts)
export type PaginatedChildren = {
  items: Children;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

export type UserProfile = {
  user_id?: string;
  name?: string;
  date_of_birth?: string | null;
  phone?: string | null;
  avatar_path?: string | null;
  document_original_name?: string | null;
};

export type FormProps = {
  oldValues?: FormikValues;
  // opcjonalny arg: id świeżo utworzonego zasobu — np. strona dodawania
  // posta przekierowuje nim od razu do edycji, żeby dodać tagi
  handleSubmit: (createdId?: string) => void;
  handleClose?: () => void;
} & UseApiMutationProps;
