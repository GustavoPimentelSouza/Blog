import { auth } from '@/lib/auth';
import { UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_BYTES } from '@/lib/upload-config';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

// In-memory rate limiter: 20 uploads por hora por usuário
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;
const uploadCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = uploadCounts.get(userId);
  if (!record || now > record.resetAt) {
    uploadCounts.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Ensure uploads directory exists once at module load
const uploadDir = join(process.cwd(), 'public', 'uploads');
mkdir(uploadDir, { recursive: true }).catch(() => {});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  if (!checkRateLimit(session.user.email)) {
    return NextResponse.json(
      { error: `Limite de ${RATE_LIMIT} uploads por hora atingido.` },
      { status: 429 },
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > UPLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Máximo permitido: ${UPLOAD_MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
  }

  const ext = UPLOAD_ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: 'Tipo não permitido. Use JPEG, PNG, WebP ou GIF.' },
      { status: 415 },
    );
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo: ${UPLOAD_MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
