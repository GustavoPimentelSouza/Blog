import { PostModel } from '@/models/post/post-model';

export type CreatePostData = Omit<PostModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePostData = Partial<CreatePostData>;

export type PaginatedPosts = {
  posts: PostModel[];
  total: number;
  totalPages: number;
};

export const POSTS_PER_PAGE = 9;

export interface PostRepository {
  findAll(): Promise<PostModel[]>;
  findAllPublished(): Promise<PostModel[]>;
  findAllPublishedPaginated(page: number): Promise<PaginatedPosts>;
  findAllPublishedByTagPaginated(tagSlug: string, page: number): Promise<PaginatedPosts>;
  findById(id: string): Promise<PostModel>;
  findBySlug(slug: string): Promise<PostModel>;
  create(data: CreatePostData): Promise<PostModel>;
  update(id: string, data: UpdatePostData): Promise<PostModel>;
  delete(id: string): Promise<void>;
}
