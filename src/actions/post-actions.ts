'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { ZodError } from 'zod';
import { auth } from '@/lib/auth';
import { postRepository } from '@/repositories/post/drizzle-post-repository';
import { toSlug } from '@/utils/slug';
import { parsePostFormData } from '@/lib/validations/post';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Não autorizado.');
  }
}

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'u', 's', 'del', 'mark', 'code', 'pre',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

export async function createPostAction(formData: FormData) {
  await requireAuth();

  let data;
  try {
    data = parsePostFormData(formData);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(err.issues[0].message);
    }
    throw err;
  }

  const slug = toSlug(data.title);

  try {
    await postRepository.create({
      ...data,
      slug,
      content: sanitize(data.content),
      tags: data.tags.map(name => ({ name, slug: toSlug(name) })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('UNIQUE') || msg.includes('unique')) {
      throw new Error('Já existe um post com esse título. Escolha um título diferente.');
    }
    throw err;
  }

  revalidatePath('/');
  redirect('/admin');
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAuth();

  let data;
  try {
    data = parsePostFormData(formData);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(err.issues[0].message);
    }
    throw err;
  }

  const updatedPost = await postRepository.update(id, {
    ...data,
    content: sanitize(data.content),
    tags: data.tags.map(name => ({ name, slug: toSlug(name) })),
  });

  revalidatePath('/');
  revalidatePath(`/post/${updatedPost.slug}`);
  redirect('/admin');
}

export async function deletePostAction(id: string) {
  await requireAuth();

  await postRepository.delete(id);
  revalidatePath('/');
}

export async function togglePublishAction(id: string, published: boolean) {
  await requireAuth();

  await postRepository.update(id, { published });
  revalidatePath('/');
}
