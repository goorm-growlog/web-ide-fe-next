/**
 * 파일 확장자 기반 언어 감지
 */

const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  json: 'json',
  md: 'markdown',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  php: 'php',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  ini: 'ini',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  dockerfile: 'dockerfile',
  dockerignore: 'plaintext',
  gitignore: 'plaintext',
  env: 'plaintext',
  txt: 'plaintext',
}

export const getLanguageFromPath = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase()
  return extension ? LANGUAGE_MAP[extension] || 'plaintext' : 'plaintext'
}

export const isTextFile = (path: string): boolean => {
  const language = getLanguageFromPath(path)
  return (
    language !== 'plaintext' || path.endsWith('.txt') || path.endsWith('.md')
  )
}
