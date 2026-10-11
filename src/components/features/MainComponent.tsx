'use client';

import { Post } from '#/interfaces';
import { useLocale } from 'next-intl';

import { getUploadUrl } from '@/lib/api';
import { cn } from '@/lib/utils/cn';

import { useApiQuery } from '@/hooks/api/useApiQuery';

// Jeden, deterministyczny odcień navy per autor (zamiast losowego przy
// każdym renderze) — suma kodów znaków imienia jako "seed", żeby ten sam
// autor miał zawsze ten sam kolor (placeholder BEZ avatara ORAZ pasek na
// górze karty, nawet gdy avatar jest prawdziwym zdjęciem) — jeden spójny
// system identyfikacji autora, nie dwa przypadkowe.
const AUTHOR_TINTS = [
  { bg: 'bg-navy', chip: 'bg-navy/[0.08] text-navy' },
  { bg: 'bg-[#2f6690]', chip: 'bg-[#2f6690]/[0.08] text-[#2f6690]' },
  { bg: 'bg-[#3a7d44]', chip: 'bg-[#3a7d44]/[0.08] text-[#3a7d44]' },
  { bg: 'bg-[#9c3d54]', chip: 'bg-[#9c3d54]/[0.08] text-[#9c3d54]' },
  { bg: 'bg-[#a8690a]', chip: 'bg-[#a8690a]/[0.08] text-[#a8690a]' }
];
const tintForName = (name: string) => {
  const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return AUTHOR_TINTS[seed % AUTHOR_TINTS.length];
};

const PostCard = ({ post, locale }: { post: Post; locale: string }) => {
  const authorName = post.author_name || '?';
  const tint = tintForName(authorName);
  const date = post.created_at
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(post.created_at)
      )
    : null;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-cloud bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-8">
      <div className={cn('absolute inset-x-0 top-0 h-1.5', tint.bg)} />

      <div className="flex items-center gap-4">
        {post.author_avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getUploadUrl(post.author_avatar_url)}
            alt={authorName}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-white object-cover shadow-md"
          />
        ) : (
          <div
            className={cn(
              'flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-md',
              tint.bg
            )}
          >
            {authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-navy">{authorName}</p>
          {date ? <p className="text-xs text-gray-400">{date}</p> : null}
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold leading-snug text-black sm:text-2xl">{post.title}</h3>
      {post.content ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
          {post.content}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags?.length ? (
          post.tags.map((tag) => (
            <span
              key={tag.id}
              className={cn('rounded-full px-3 py-1 text-xs font-medium', tint.chip)}
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">bez tagów</span>
        )}
      </div>
    </article>
  );
};

export const HomeComponent = () => {
  const locale = useLocale();
  // Publiczny podgląd — GET /posts nie wymaga logowania. Zero przycisków
  // (edycja/dodawanie/tagowanie żyje na /posts i /tags), to tylko odczyt.
  const { data: posts } = useApiQuery({ route: 'POSTS' });

  const authorsCount = posts?.length ? new Set(posts.map((post: Post) => post.author_id)).size : 0;

  return (
    <div className="w-full pb-16">
      <header className="relative mb-10 overflow-hidden rounded-2xl bg-navy px-8 py-12 text-white sm:px-14 sm:py-16">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/[0.04]" />
        <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Aktualności
        </p>
        <h1 className="relative mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Najnowsze posty
        </h1>
        {posts?.length ? (
          <p className="relative mt-3 text-sm text-white/70">
            {posts.length} {posts.length === 1 ? 'post' : 'postów'} od {authorsCount}{' '}
            {authorsCount === 1 ? 'autora' : 'autorów'}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts?.length ? (
          posts.map((post: Post) => <PostCard key={post.id} post={post} locale={locale} />)
        ) : (
          <p className="col-span-full rounded-2xl border border-dashed border-cloud py-16 text-center text-sm text-gray-400">
            Brak postów — bądź pierwszy/a.
          </p>
        )}
      </div>
    </div>
  );
};
