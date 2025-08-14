interface MockFile {
  id: string
  filepath: string
  name: string
  language?: string
}

const mockFiles: MockFile[] = [
  {
    id: 'file-1',
    filepath: 'src/components/Button.tsx',
    name: 'Button.tsx',
    language: 'typescript',
  },
  {
    id: 'file-2',
    filepath: 'src/utils/helpers.js',
    name: 'helpers.js',
    language: 'javascript',
  },
  {
    id: 'file-3',
    filepath: 'README.md',
    name: 'README.md',
    language: 'markdown',
  },
]

export { type MockFile, mockFiles }
