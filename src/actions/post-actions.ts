'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { postRepository } from '@/repositories/post/drizzle-post-repository';
import { toSlug } from '@/utils/slug';

export async function createPostAction(formData: FormData) {
  const title = formData.get('title') as string;

  await postRepository.create({
    title,
    slug: toSlug(title),
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string,
    coverImageUrl: formData.get('coverImageUrl') as string,
    published: formData.get('published') === 'true',
  });

  revalidatePath('/');
  redirect('/admin');
}

export async function updatePostAction(id: string, formData: FormData) {
  const post = await postRepository.findById(id);

  await postRepository.update(id, {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string,
    coverImageUrl: formData.get('coverImageUrl') as string,
    published: formData.get('published') === 'true',
  });

  revalidatePath('/');
  revalidatePath(`/post/${post.slug}`);
  redirect('/admin');
}

export async function deletePostAction(id: string) {
  await postRepository.delete(id);
  revalidatePath('/');
  redirect('/admin');
}

export async function togglePublishAction(id: string, published: boolean) {
  await postRepository.update(id, { published });
  revalidatePath('/');
}
