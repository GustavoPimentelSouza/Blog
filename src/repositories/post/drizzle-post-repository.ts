import { eq } from 'drizzle-orm';
import { drizzleDb } from '@/db/drizzle';
import { postsTable } from '@/db/drizzle/schemas';
import { PostModel } from '@/models/post/post-model';
import { PostRepository, CreatePostData, UpdatePostData } from './post-repository';
import { randomUUID } from 'node:crypto';

export class DrizzlePostRepository implements PostRepository {
  async findAll(): Promise<PostModel[]> {
    return drizzleDb.select().from(postsTable);
  }

  async findAllPublished(): Promise<PostModel[]> {
    return drizzleDb.select().from(postsTable).where(eq(postsTable.published, true));
  }

  async findById(id: string): Promise<PostModel> {
    const [post] = await drizzleDb.select().from(postsTable).where(eq(postsTable.id, id));
    if (!post) throw new Error('Post não encontrado para ID');
    return post;
  }

  async findBySlug(slug: string): Promise<PostModel> {
    const [post] = await drizzleDb.select().from(postsTable).where(eq(postsTable.slug, slug));
    if (!post) throw new Error('Post não encontrado para slug');
    return post;
  }

  async create(data: CreatePostData): Promise<PostModel> {
    const now = new Date().toISOString();
    const id = randomUUID();
    const [post] = await drizzleDb.insert(postsTable).values({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }).returning();
    return post;
  }

  async update(id: string, data: UpdatePostData): Promise<PostModel> {
    const [post] = await drizzleDb.update(postsTable)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!post) throw new Error('Post não encontrado para ID');
    return post;
  }

  async delete(id: string): Promise<void> {
    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));
  }
}

export const postRepository = new DrizzlePostRepository();
