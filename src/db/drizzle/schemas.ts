import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const postsTable = sqliteTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  published: integer('published', { mode: 'boolean' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type PostsTableSelectMode = InferSelectModel<typeof postsTable>;
export type PostsTableInsertMode = InferInsertModel<typeof postsTable>;

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull(),
});

export type UsersTableSelectMode = InferSelectModel<typeof usersTable>;
export type UsersTableInsertMode = InferInsertModel<typeof usersTable>;

export const tagsTable = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

export type TagsTableSelectMode = InferSelectModel<typeof tagsTable>;
export type TagsTableInsertMode = InferInsertModel<typeof tagsTable>;

export const postTagsTable = sqliteTable('post_tags', {
  postId: text('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tagsTable.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.postId, table.tagId] }),
]);

export const postsRelations = relations(postsTable, ({ many }) => ({
  postTags: many(postTagsTable),
}));

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  postTags: many(postTagsTable),
}));

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
  post: one(postsTable, { fields: [postTagsTable.postId], references: [postsTable.id] }),
  tag: one(tagsTable, { fields: [postTagsTable.tagId], references: [tagsTable.id] }),
}));
