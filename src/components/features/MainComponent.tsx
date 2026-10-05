'use client';

import { Post } from '#/interfaces';
import { useTranslations } from 'next-intl';

import { useApiQuery } from '@/hooks/api/useApiQuery';

export const HomeComponent = () => {
  const t = useTranslations('Home');
  // Publiczny podgląd — GET /posts nie wymaga logowania. Zero przycisków
  // (edycja/dodawanie/tagowanie żyje na /posts i /tags), to tylko odczyt.
  const { data: posts } = useApiQuery({ route: 'POSTS' });

  return (
    <div>
      <section className="bg-white px-4 dark:bg-gray-900 my-8 flex justify-center">
        {t(`title`)}
      </section>
      <span className="text-lg text-blue-500 font-bold">{t(`content`)}</span>

      <div className="mt-10 max-w-2xl">
        <span className="font-bold">Wszystkie posty:</span>
        <div className="flex flex-col gap-4 mt-3">
          {posts?.length ? (
            posts.map((post: Post) => (
              <div key={post.id} className="border-b border-cloud pb-3">
                <div>
                  <span className="font-bold">{post.title}</span>
                  <span className="text-gray-500 ml-2">autor: {post.author_name}</span>
                </div>
                {post.content ? <p className="text-sm text-gray-500 mt-1">{post.content}</p> : null}
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags?.length ? (
                    post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-xs border border-cloud px-2 py-0.5 text-xs text-gray-500"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">bez tagów</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-400">brak postów</span>
          )}
        </div>
      </div>
    </div>
  );
};
