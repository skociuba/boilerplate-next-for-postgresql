'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { Tag } from '#/interfaces';

import { useApiMutation } from '@/hooks/api/useApiMutation';

export const usePage = ({ refetch }: { refetch: () => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const { mutate: addMutate, isLoading: isAdding } = useApiMutation({
    route: 'TAG_ADD',
    method: 'POST'
  });

  const { mutate: deleteMutate } = useApiMutation({
    route: 'TAG_DELETE',
    method: 'DELETE'
  });

  const { mutate: editMutate } = useApiMutation({
    route: 'TAG_EDIT',
    method: 'PUT'
  });

  const handleAdd = (event: FormEvent) => {
    event.preventDefault();
    if (!newTagName.trim()) return;
    // "sukces" mutacji w tym kliencie = zapytanie się wykonało, NIE że API
    // zwróciło 2xx — trzeba samemu sprawdzić error (np. 409 duplikat nazwy),
    // inaczej pole czyściłoby się nawet po nieudanym dodaniu
    addMutate(
      { name: newTagName },
      {
        onSuccess: ({ error }) => {
          if (error) {
            toast(error, {
              position: 'bottom-left',
              autoClose: 4000,
              type: 'error',
              theme: 'colored'
            });
            return;
          }
          setNewTagName('');
          toast('Tag dodany', {
            position: 'bottom-left',
            autoClose: 3000,
            type: 'success',
            theme: 'colored'
          });
          refetch();
        }
      }
    );
  };

  const handleDelete = (tag: Tag) => {
    if (!tag?.id) return;
    deleteMutate({ id: tag?.id }, { onSuccess: () => refetch() });
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id ?? null);
    setDraftName(tag.name ?? '');
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (tagId: string) => {
    if (!draftName.trim()) return;
    editMutate(
      { id: tagId, name: draftName },
      {
        onSuccess: () => {
          setEditingId(null);
          refetch();
        }
      }
    );
  };

  return {
    editingId,
    draftName,
    setDraftName,
    startEdit,
    cancelEdit,
    saveEdit,
    handleDelete,
    newTagName,
    setNewTagName,
    handleAdd,
    isAdding
  };
};
