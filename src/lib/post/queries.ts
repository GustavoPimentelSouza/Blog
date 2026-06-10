import { cache } from 'react';
import { postRepository } from '@/repositories/post/drizzle-post-repository';

export const findAllPostsCached = cache(() => postRepository.findAll());
export const findAllPublishedPostsCached = cache(() => postRepository.findAllPublished());
export const findAllPublishedPaginatedCached = cache((page: number) =>
  postRepository.findAllPublishedPaginated(page),
);
export const findAllPublishedByTagPaginatedCached = cache((tagSlug: string, page: number) =>
  postRepository.findAllPublishedByTagPaginated(tagSlug, page),
);

export const findPostBySlugCached = cache((slug: string) => postRepository.findBySlug(slug));

export const findPostByIdCached = cache((id: string) => postRepository.findById(id));
