import { eq, count, inArray } from 'drizzle-orm';
import { drizzleDb } from '@/db/drizzle';
import { postsTable, tagsTable, postTagsTable } from '@/db/drizzle/schemas';
import { PostModel, TagModel } from '@/models/post/post-model';
import { PostRepository, CreatePostData, UpdatePostData, PaginatedPosts, POSTS_PER_PAGE } from './post-repository';
import { randomUUID } from 'node:crypto';
import { toSlug } from '@/utils/slug';

async function attachTags(posts: (typeof postsTable.$inferSelect)[]): Promise<PostModel[]> {
  if (posts.length === 0) return [];

  const postIds = posts.map(p => p.id);

  const rows = await drizzleDb
    .select({ postId: postTagsTable.postId, name: tagsTable.name, slug: tagsTable.slug })
    .from(postTagsTable)
    .innerJoin(tagsTable, eq(postTagsTable.tagId, tagsTable.id))
    .where(inArray(postTagsTable.postId, postIds));

  const tagsByPost = new Map<string, TagModel[]>();
  for (const row of rows) {
    const list = tagsByPost.get(row.postId) ?? [];
    list.push({ name: row.name, slug: row.slug });
    tagsByPost.set(row.postId, list);
  }

  return posts.map(p => ({ ...p, tags: tagsByPost.get(p.id) ?? [] }));
}

async function upsertTags(tagNames: string[]): Promise<string[]> {
  if (tagNames.length === 0) return [];

  const ids: string[] = [];
  for (const name of tagNames) {
    const slug = toSlug(name);
    const existing = await drizzleDb.select().from(tagsTable).where(eq(tagsTable.slug, slug));
    if (existing.length > 0) {
      ids.push(existing[0].id);
    } else {
      const id = randomUUID();
      await drizzleDb.insert(tagsTable).values({ id, name: name.trim(), slug, createdAt: new Date().toISOString() });
      ids.push(id);
    }
  }
  return ids;
}

export class DrizzlePostRepository implements PostRepository {
  async findAll(): Promise<PostModel[]> {
    const posts = await drizzleDb.select().from(postsTable);
    return attachTags(posts);
  }

  async findAllPublished(): Promise<PostModel[]> {
    const posts = await drizzleDb.select().from(postsTable).where(eq(postsTable.published, true));
    return attachTags(posts);
  }

  async findAllPublishedPaginated(page: number): Promise<PaginatedPosts> {
    const offset = (page - 1) * POSTS_PER_PAGE;

    const [posts, [{ total }]] = await Promise.all([
      drizzleDb.select().from(postsTable)
        .where(eq(postsTable.published, true))
        .limit(POSTS_PER_PAGE)
        .offset(offset),
      drizzleDb.select({ total: count() }).from(postsTable)
        .where(eq(postsTable.published, true)),
    ]);

    return {
      posts: await attachTags(posts),
      total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
    };
  }

  async findAllPublishedByTagPaginated(tagSlug: string, page: number): Promise<PaginatedPosts> {
    const offset = (page - 1) * POSTS_PER_PAGE;

    const [tag] = await drizzleDb.select().from(tagsTable).where(eq(tagsTable.slug, tagSlug));
    if (!tag) return { posts: [], total: 0, totalPages: 0 };

    const postIdsRows = await drizzleDb
      .select({ postId: postTagsTable.postId })
      .from(postTagsTable)
      .where(eq(postTagsTable.tagId, tag.id));

    if (postIdsRows.length === 0) return { posts: [], total: 0, totalPages: 0 };

    const postIds = postIdsRows.map(r => r.postId);

    const [posts, [{ total }]] = await Promise.all([
      drizzleDb.select().from(postsTable)
        .where(inArray(postsTable.id, postIds))
        .limit(POSTS_PER_PAGE)
        .offset(offset),
      drizzleDb.select({ total: count() }).from(postsTable)
        .where(inArray(postsTable.id, postIds)),
    ]);

    const publishedPosts = posts.filter(p => p.published);
    return {
      posts: await attachTags(publishedPosts),
      total: publishedPosts.length < posts.length ? publishedPosts.length : total,
      totalPages: Math.ceil(total / POSTS_PER_PAGE),
    };
  }

  async findById(id: string): Promise<PostModel> {
    const [post] = await drizzleDb.select().from(postsTable).where(eq(postsTable.id, id));
    if (!post) throw new Error('Post não encontrado para ID');
    const [withTags] = await attachTags([post]);
    return withTags;
  }

  async findBySlug(slug: string): Promise<PostModel> {
    const [post] = await drizzleDb.select().from(postsTable).where(eq(postsTable.slug, slug));
    if (!post) throw new Error('Post não encontrado para slug');
    const [withTags] = await attachTags([post]);
    return withTags;
  }

  async create(data: CreatePostData): Promise<PostModel> {
    const now = new Date().toISOString();
    const id = randomUUID();

    const { tags, ...postData } = data;

    const [post] = await drizzleDb.insert(postsTable).values({
      id,
      ...postData,
      createdAt: now,
      updatedAt: now,
    }).returning();

    if (tags.length > 0) {
      const tagIds = await upsertTags(tags.map(t => t.name));
      await drizzleDb.insert(postTagsTable).values(
        tagIds.map(tagId => ({ postId: id, tagId }))
      );
    }

    return { ...post, tags };
  }

  async update(id: string, data: UpdatePostData): Promise<PostModel> {
    const { tags, ...postData } = data;

    const [post] = await drizzleDb.update(postsTable)
      .set({ ...postData, updatedAt: new Date().toISOString() })
      .where(eq(postsTable.id, id))
      .returning();
    if (!post) throw new Error('Post não encontrado para ID');

    if (tags !== undefined) {
      await drizzleDb.delete(postTagsTable).where(eq(postTagsTable.postId, id));
      if (tags.length > 0) {
        const tagIds = await upsertTags(tags.map(t => t.name));
        await drizzleDb.insert(postTagsTable).values(
          tagIds.map(tagId => ({ postId: id, tagId }))
        );
      }
    }

    const [withTags] = await attachTags([post]);
    return withTags;
  }

  async delete(id: string): Promise<void> {
    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));
  }
}

export const postRepository = new DrizzlePostRepository();
