import { describe, it, expect } from 'vitest';
import { toSlug } from '@/utils/slug';

describe('toSlug', () => {
  it('converte texto simples para slug', () => {
    expect(toSlug('Meu Post')).toBe('meu-post');
  });

  it('remove acentos', () => {
    expect(toSlug('Rotina matinal de pessoas altamente eficazes')).toBe('rotina-matinal-de-pessoas-altamente-eficazes');
  });

  it('remove caracteres especiais', () => {
    expect(toSlug('Olá, mundo!')).toBe('ola-mundo');
  });

  it('converte para minúsculo', () => {
    expect(toSlug('TITULO EM MAIUSCULO')).toBe('titulo-em-maiusculo');
  });

  it('substitui múltiplos espaços por um hífen', () => {
    expect(toSlug('título   com   espaços')).toBe('titulo-com-espacos');
  });

  it('remove espaços no início e fim', () => {
    expect(toSlug('  título com espaços  ')).toBe('titulo-com-espacos');
  });
});
