'use client';

import { Post } from '#/interfaces';
import { useLocale } from 'next-intl';
import { Fragment, useState } from 'react';

import { Modal } from '@/ui/Modal';

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

const formatDate = (iso: string | undefined, locale: string) =>
  iso
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : null;

// Linki w treści posta (np. "Czytaj więcej na https://...") są klikalne w
// pełnym widoku. Zwykły podział tekstu, bez dangerouslySetInnerHTML — React
// i tak escapuje każdy kawałek, więc treść od użytkownika nie wstrzyknie HTML.
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const Linkified = ({ text }: { text: string }) => (
  <>
    {text.split(URL_PATTERN).map((part, index) =>
      index % 2 === 1 ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="break-all text-sky-700 underline hover:text-sky-900"
        >
          {part}
        </a>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      )
    )}
  </>
);

const AuthorBadge = ({ post, locale, size }: { post: Post; locale: string; size: 'sm' | 'md' }) => {
  const authorName = post.author_name || '?';
  const tint = tintForName(authorName);
  const date = formatDate(post.created_at, locale);
  const avatarSize = size === 'md' ? 'h-12 w-12 text-lg' : 'h-10 w-10 text-base';

  return (
    <div className="flex items-center gap-3">
      {post.author_avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getUploadUrl(post.author_avatar_url)}
          alt=""
          className={cn('shrink-0 rounded-full object-cover ring-2 ring-white', avatarSize)}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
            avatarSize,
            tint.bg
          )}
        >
          {authorName.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{authorName}</p>
        {date ? <p className="text-xs text-slate-500">{date}</p> : null}
      </div>
    </div>
  );
};

const Tags = ({ post }: { post: Post }) => {
  const tint = tintForName(post.author_name || '?');

  return post.tags?.length ? (
    <ul className="flex flex-wrap gap-2">
      {post.tags.map((tag) => (
        <li key={tag.id} className={cn('rounded-full px-3 py-1 text-xs font-medium', tint.chip)}>
          {tag.name}
        </li>
      ))}
    </ul>
  ) : null;
};

// Cały kafel jest przyciskiem (nie <article> z osobnym linkiem "więcej"):
// jeden duży cel do kliknięcia, działa z klawiatury (Tab + Enter) i czytnik
// ekranu ogłasza go jako przycisk otwierający szczegóły.
const PostCard = ({ post, locale, onOpen }: { post: Post; locale: string; onOpen: () => void }) => {
  const tint = tintForName(post.author_name || '?');

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-1', tint.bg)} />

      <AuthorBadge post={post} locale={locale} size="sm" />

      {/* Tytuł zawsze w całości, treść przycięta do 3 linii — wysokość
          kafli wyrównuje siatka (auto-rows-fr), a pełna treść jest w oknie.
          overflow-wrap:anywhere zamiast break-words: w kolumnie flex długi
          URL bez spacji i tak rozpychał akapit na szerokość całego adresu
          (break-words nie zmniejsza minimalnej szerokości elementu). */}
      <h3 className="mt-4 w-full text-lg font-bold leading-snug text-slate-900 [overflow-wrap:anywhere]">
        {post.title}
      </h3>
      {post.content ? (
        <p className="mt-2 line-clamp-3 w-full text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
          {post.content}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
        <Tags post={post} />
        <span className="ml-auto text-sm font-medium text-navy group-hover:underline">
          Czytaj dalej <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  );
};

export const HomeComponent = () => {
  const locale = useLocale();
  // Publiczny podgląd — GET /posts nie wymaga logowania. Zero przycisków
  // (edycja/dodawanie/tagowanie żyje na /posts i /tags), to tylko odczyt.
  const { data: posts } = useApiQuery({ route: 'POSTS' });
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const authorsCount = posts?.length ? new Set(posts.map((post: Post) => post.author_id)).size : 0;

  return (
    <div className="w-full">
      <header className="relative mb-8 overflow-hidden rounded-2xl bg-navy px-6 py-10 text-white sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/[0.04]" />
        <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Aktualności
        </p>
        <h1 className="relative mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Najnowsze posty
        </h1>
        {posts?.length ? (
          <p className="relative mt-3 text-sm text-white/70">
            {posts.length} {posts.length === 1 ? 'post' : 'postów'} od {authorsCount}{' '}
            {authorsCount === 1 ? 'autora' : 'autorów'}
          </p>
        ) : null}
      </header>

      {posts?.length ? (
        <ul className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <li key={post.id} className="min-w-0">
              <PostCard post={post} locale={locale} onOpen={() => setOpenPost(post)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">
          Brak postów — bądź pierwszy/a.
        </p>
      )}

      <Modal open={Boolean(openPost)} onClose={() => setOpenPost(null)} title={openPost?.title}>
        {openPost ? (
          <div className="flex flex-col gap-5">
            <AuthorBadge post={openPost} locale={locale} size="md" />
            {openPost.content ? (
              <p className="whitespace-pre-line break-words leading-relaxed text-slate-700">
                <Linkified text={openPost.content} />
              </p>
            ) : (
              <p className="text-sm text-slate-500">Ten post nie ma treści.</p>
            )}
            <Tags post={openPost} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
