import { contextBridge, ipcRenderer, webUtils } from 'electron'

export interface SiblingFile {
  name: string
  path: string
}

export interface ElectronAPI {
  platform: NodeJS.Platform
  listSystemFonts: () => Promise<string[]>
  openFile: () => Promise<{ path: string; content: string } | null>
  openFilePath: (path: string) => Promise<{ path: string; content: string } | null>
  listSiblings: () => Promise<SiblingFile[] | null>
  openSibling: (path: string) => Promise<boolean>
  saveFile: (content: string) => Promise<boolean>
  saveFileAs: (content: string) => Promise<boolean>
  autoSaveDocument: (content: string) => Promise<string | null>
  setDocumentDirty: (dirty: boolean) => void
  closeWindowAfterSave: () => void
  exportPDF: () => Promise<boolean>
  newSlides: () => Promise<string | null>
  openAsSlides: (content: string) => Promise<boolean>
  loadCustomTheme: () => Promise<{ name: string; css: string } | null>
  loadThemeCSS: (fileName: string) => Promise<string | null>
  getPathForFile: (file: File) => string
  openExternal: (url: string) => void
  onFileChanged: (callback: (content: string) => void) => void
  onNewFile: (callback: () => void) => void
  onFileOpened: (callback: (data: { path: string; content: string }) => void) => void
  onMenuOpen: (callback: () => void) => void
  onMenuSave: (callback: () => void) => void
  onMenuSaveAs: (callback: () => void) => void
  onMenuSaveAndClose: (callback: () => void) => void
  onMenuExportPDF: (callback: () => void) => void
  onMenuNewSlides: (callback: () => void) => void
  onMenuOpenAsSlides: (callback: () => void) => void
  onNewSlidesContent: (callback: (content: string) => void) => void
  onSetTheme: (callback: (theme: string) => void) => void
  onSetFont: (callback: (fontFamily: string) => void) => void
  onShowFontSettings: (callback: () => void) => void
  onSetCustomCSS: (callback: (css: string) => void) => void
  onMenuImportTheme: (callback: () => void) => void
  exportSlides: (content: string) => Promise<boolean>
  onMenuExportSlides: (callback: () => void) => void
  onAgentActivity: (callback: (state: string) => void) => void
  onSearch: (callback: () => void) => void
  onMathModal: (callback: () => void) => void
  onSiblingsChanged: (callback: (files: SiblingFile[]) => void) => void
  onToggleFilePanel: (callback: () => void) => void
}

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  listSystemFonts: () => ipcRenderer.invoke('list-system-fonts'),
  openFile: () => ipcRenderer.invoke('open-file'),
  openFilePath: (path: string) => ipcRenderer.invoke('open-file-path', path),
  listSiblings: () => ipcRenderer.invoke('list-siblings'),
  openSibling: (path: string) => ipcRenderer.invoke('open-sibling', path),
  saveFile: (content: string) => ipcRenderer.invoke('save-file', content),
  saveFileAs: (content: string) => ipcRenderer.invoke('save-file-as', content),
  autoSaveDocument: (content: string) => ipcRenderer.invoke('auto-save-document', content),
  setDocumentDirty: (dirty: boolean) => ipcRenderer.send('set-document-dirty', dirty),
  closeWindowAfterSave: () => ipcRenderer.send('close-window-after-save'),
  exportPDF: () => ipcRenderer.invoke('export-pdf'),
  exportSlides: (content: string) => ipcRenderer.invoke('export-slides', content),
  newSlides: () => ipcRenderer.invoke('new-slides'),
  openAsSlides: (content: string) => ipcRenderer.invoke('open-as-slides', content),
  loadCustomTheme: () => ipcRenderer.invoke('load-custom-theme'),
  loadThemeCSS: (fileName: string) => ipcRenderer.invoke('load-theme-css', fileName),
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  onFileChanged: (callback: (content: string) => void) => {
    ipcRenderer.on('file-changed', (_event, content) => callback(content))
  },
  onNewFile: (callback: () => void) => {
    ipcRenderer.on('new-file', () => callback())
  },
  onFileOpened: (callback: (data: { path: string; content: string }) => void) => {
    ipcRenderer.on('file-opened', (_event, data) => callback(data))
  },
  onMenuOpen: (callback: () => void) => {
    ipcRenderer.on('menu-open', () => callback())
  },
  onMenuSave: (callback: () => void) => {
    ipcRenderer.on('menu-save', () => callback())
  },
  onMenuSaveAs: (callback: () => void) => {
    ipcRenderer.on('menu-save-as', () => callback())
  },
  onMenuExportPDF: (callback: () => void) => {
    ipcRenderer.on('menu-export-pdf', () => callback())
  },
  onMenuNewSlides: (callback: () => void) => {
    ipcRenderer.on('menu-new-slides', () => callback())
  },
  onMenuOpenAsSlides: (callback: () => void) => {
    ipcRenderer.on('menu-open-as-slides', () => callback())
  },
  onNewSlidesContent: (callback: (content: string) => void) => {
    ipcRenderer.on('new-slides-content', (_event, content) => callback(content))
  },
  onSetTheme: (callback: (theme: string) => void) => {
    ipcRenderer.on('set-theme', (_event, theme) => callback(theme))
  },
  onMenuSaveAndClose: (callback: () => void) => {
    ipcRenderer.on('menu-save-and-close', () => callback())
  },
  onSetFont: (callback: (fontFamily: string) => void) => {
    ipcRenderer.on('set-font', (_event, fontFamily) => callback(fontFamily))
  },
  onShowFontSettings: (callback: () => void) => {
    ipcRenderer.on('show-font-settings', () => callback())
  },
  onSetCustomCSS: (callback: (css: string) => void) => {
    ipcRenderer.on('set-custom-css', (_event, css) => callback(css))
  },
  onMenuImportTheme: (callback: () => void) => {
    ipcRenderer.on('menu-import-theme', () => callback())
  },
  onMenuExportSlides: (callback: () => void) => {
    ipcRenderer.on('menu-export-slides', () => callback())
  },
  onAgentActivity: (callback: (state: string) => void) => {
    ipcRenderer.on('agent-activity', (_event, state) => callback(state))
  },
  onSearch: (callback: () => void) => {
    ipcRenderer.on('editor:search', () => callback())
  },
  onMathModal: (callback: () => void) => {
    ipcRenderer.on('editor:math', () => callback())
  },
  onSiblingsChanged: (callback: (files: SiblingFile[]) => void) => {
    ipcRenderer.on('siblings-changed', (_event, files) => callback(files))
  },
  onToggleFilePanel: (callback: () => void) => {
    ipcRenderer.on('toggle-file-panel', () => callback())
  }
} satisfies ElectronAPI)
