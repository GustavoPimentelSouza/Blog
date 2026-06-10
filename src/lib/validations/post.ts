import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200, 'Título muito longo'),
  author: z.string().min(2, 'Autor deve ter pelo menos 2 caracteres').max(100, 'Nome do autor muito longo'),
  excerpt: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres').max(500, 'Resumo muito longo'),
  coverImageUrl: z.string(),
  content: z.string().refine(
    (v) => v.replace(/<[^>]*>/g, '').trim().length > 0,
    'Conteúdo não pode estar vazio',
  ),
  published: z.boolean(),
  tags: z.array(z.string().min(1).max(50)).max(10),
});

export type PostFormData = z.infer<typeof postSchema>;

export function parsePostFormData(formData: FormData): PostFormData {
  const rawTags = formData.getAll('tags') as string[];
  const tags = rawTags.filter(t => t.trim().length > 0);

  return postSchema.parse({
    title: formData.get('title'),
    author: formData.get('author'),
    excerpt: formData.get('excerpt'),
    coverImageUrl: formData.get('coverImageUrl') ?? '',
    content: formData.get('content'),
    published: formData.get('published') === 'true',
    tags,
  });
}
