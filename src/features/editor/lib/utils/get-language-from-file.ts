export const getLanguageFromFile = (fileName: string): string | undefined => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
  }
  return ext ? map[ext] : undefined
}
