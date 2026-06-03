import { PostModel } from '@/models/post/post-model';

export type CreatePostData = Omit<PostModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePostData = Partial<CreatePostData>;

export interface PostRepository {
  findAll(): Promise<PostModel[]>;
  findAllPublished(): Promise<PostModel[]>;
  findById(id: string): Promise<PostModel>;
  findBySlug(slug: string): Promise<PostModel>;
  create(data: CreatePostData): Promise<PostModel>;
  update(id: string, data: UpdatePostData): Promise<PostModel>;
  delete(id: string): Promise<void>;
}
