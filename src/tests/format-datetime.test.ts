import { describe, it, expect } from 'vitest';
import { formatDatetime, formatRelativeDate } from '@/utils/format-datetime';

describe('formatDatetime', () => {
  it('formata data corretamente', () => {
    const result = formatDatetime('2025-04-08T00:24:38.616Z');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} às \d{2}h\d{2}/);
  });

  it('retorna string não vazia para qualquer data válida', () => {
    const result = formatDatetime('2025-01-01T10:00:00Z');
    expect(result).toBeTruthy();
  });
});

describe('formatRelativeDate', () => {
  it('retorna string relativa não vazia', () => {
    const result = formatRelativeDate('2025-04-08T00:24:38.616Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
