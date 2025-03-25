import { getConfig } from './config';

const DEFAULT_LANGUAGES = [
  'html',
  'handlebars',
  'twig',
  'php',
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
  'vue',
  'svelte',
];

export function getEffectiveLanguages(): string[] {
  const config = getConfig();

  const includes = config.get<string[]>('includeLanguages') ?? [];
  const excludes = config.get<string[]>('excludeLanguages') ?? [];

  const combined = new Set([...DEFAULT_LANGUAGES, ...includes]);

  for (const lang of excludes) {
    combined.delete(lang);
  }

  return [...combined];
}
