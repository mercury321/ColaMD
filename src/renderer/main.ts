import { createEditor, defaultContent, getMarkdown, setMarkdown, showMathModal } from './editor/editor'
import { SearchPanel } from './editor/search-panel'
import { applyTheme, loadSavedTheme } from './themes/theme-manager'
import './themes/base.css'
import './themes/premium.css'

const FONT_STORAGE_KEY = 'colamd-editor-font'
const FONT_NAME_STORAGE_KEY = 'colamd-editor-font-name'

function applyEditorFont(fontFamily: string): void {
  const value = fontFamily.trim()
  if (!value) {
    document.documentElement.style.removeProperty('--editor-font-family')
    document.body.classList.remove('has-font-override')
    localStorage.removeItem(FONT_STORAGE_KEY)
    localStorage.removeItem(FONT_NAME_STORAGE_KEY)
    return
  }

  document.documentElement.style.setProperty('--editor-font-family', value)
  document.body.classList.add('has-font-override')
  localStorage.setItem(FONT_STORAGE_KEY, value)
  const firstFamily = value.match(/^"([^"]+)"/)?.[1] || value.split(',')[0].trim()
  if (firstFamily) localStorage.setItem(FONT_NAME_STORAGE_KEY, firstFamily)
}

function loadSavedFont(): void {
  applyEditorFont(localStorage.getItem(FONT_STORAGE_KEY) || '')
}

function fontStackFromName(fontName: string): string {
  const escaped = fontName.trim().replace(/["\\]/g, '\\$&')
  return `"${escaped}", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`
}

async function showFontSettings(): Promise<void> {
  if (document.querySelector('.font-modal-overlay')) return

  const fonts = await window.electronAPI.listSystemFonts()
  if (fonts.length === 0) return

  const overlay = document.createElement('div')
  overlay.className = 'font-modal-overlay'
  overlay.innerHTML = `
    <section class="font-modal" role="dialog" aria-modal="true" aria-labelledby="font-modal-title">
      <h3 id="font-modal-title">选择正文字体</h3>
      <p>从这台电脑已经安装的字体中选择，下方会即时显示正文排版效果。</p>
      <input class="font-modal-search" type="search" autocomplete="off" placeholder="搜索系统字体">
      <div class="font-modal-content">
        <select class="font-modal-select" size="11" aria-label="系统字体列表"></select>
        <article class="font-modal-preview">
          <h4>让文字拥有合适的气质</h4>
          <p>字体决定阅读的节奏，也影响长文在屏幕上的清晰度与舒适度。</p>
          <p><strong>重点预览：</strong>中文、English、数字 123456，以及标点「，。！？」。</p>
          <blockquote>好的排版，让文字安静地抵达读者。</blockquote>
        </article>
      </div>
      <div class="font-modal-footer">
        <button class="font-modal-btn cancel" type="button">取消</button>
        <button class="font-modal-btn save" type="button">应用</button>
      </div>
    </section>`

  const search = overlay.querySelector('.font-modal-search') as HTMLInputElement
  const select = overlay.querySelector('.font-modal-select') as HTMLSelectElement
  const preview = overlay.querySelector('.font-modal-preview') as HTMLElement
  let selectedFont = localStorage.getItem(FONT_NAME_STORAGE_KEY) || fonts[0]
  const close = (): void => overlay.remove()
  const apply = (): void => {
    if (!selectedFont) return
    applyEditorFont(fontStackFromName(selectedFont))
    close()
  }

  const updatePreview = (): void => {
    preview.style.fontFamily = fontStackFromName(selectedFont)
  }
  const renderOptions = (query = ''): void => {
    const keyword = query.trim().toLocaleLowerCase()
    const visibleFonts = keyword
      ? fonts.filter((font) => font.toLocaleLowerCase().includes(keyword))
      : fonts
    select.replaceChildren(...visibleFonts.map((font) => {
      const option = document.createElement('option')
      option.value = font
      option.textContent = font
      option.style.fontFamily = fontStackFromName(font)
      option.selected = font === selectedFont
      return option
    }))
    if (visibleFonts.length > 0 && !visibleFonts.includes(selectedFont)) {
      selectedFont = visibleFonts[0]
      select.value = selectedFont
      updatePreview()
    }
  }

  renderOptions()
  updatePreview()
  search.addEventListener('input', () => renderOptions(search.value))
  select.addEventListener('change', () => {
    selectedFont = select.value
    updatePreview()
  })
  overlay.querySelector('.cancel')?.addEventListener('click', close)
  overlay.querySelector('.save')?.addEventListener('click', apply)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })

  document.body.appendChild(overlay)
  search.focus()
}

function isSlidesContent(content: string): boolean {
  return /^---\s*\n[\s\S]*?(kicker|chip):/m.test(content)
}

let sourceModeActive = false
const editorEl = () => document.getElementById('editor') as HTMLElement
const sourceEl = () => document.getElementById('source-editor') as HTMLTextAreaElement
const slidesBtnEl = () => document.getElementById('slides-btn') as HTMLButtonElement
const filePanelEl = () => document.getElementById('file-panel') as HTMLElement
const fileListEl = () => document.getElementById('file-list') as HTMLElement
const fileToggleBtnEl = () => document.getElementById('file-toggle-btn') as HTMLButtonElement

// --- Same-directory file panel ---
let currentFilePath: string | null = null
let dirty = false
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null
let agentActivityState: 'idle' | 'active' | 'cooldown' = 'idle'
// Milkdown's markdownUpdated listener fires 200ms-debounced AFTER a doc change,
// so a programmatic load would spuriously mark the doc dirty unless we keep a
// suppression window long enough to cover that debounce.
let applyingUntil = 0
let manualHidden = localStorage.getItem('file-panel-hidden') === '1'

function setDirtyState(value: boolean): void {
  dirty = value
  window.electronAPI.setDocumentDirty(value)
  updateStatusDot()
}

function updateStatusDot(): void {
  const statusDot = document.getElementById('agent-dot')
  if (!statusDot) return

  statusDot.className = agentActivityState === 'active'
    ? 'agent-active'
    : agentActivityState === 'cooldown'
      ? 'agent-cooldown'
      : dirty ? 'unsaved' : ''
  statusDot.setAttribute('title', agentActivityState === 'active'
    ? 'Agent 正在编辑'
    : agentActivityState === 'cooldown'
      ? 'Agent 刚完成编辑'
      : dirty ? '有未保存的修改' : '已保存')
}

function scheduleAutoSave(): void {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => {
    autoSaveTimer = null
    void window.electronAPI.autoSaveDocument(getContent())
  }, 1000)
}

function markApplying(): void {
  applyingUntil = Date.now() + 350
}

function applyContent(content: string): void {
  markApplying()
  setContent(content)
}

function updatePanelVisibility(): void {
  // After closing the active document, keep the last directory's file list
  // visible so another document can be opened immediately from the sidebar.
  const hasFiles = fileListEl().childElementCount > 0
  const show = (currentFilePath !== null || hasFiles) && !manualHidden
  filePanelEl().hidden = !show
  document.body.classList.toggle('show-file-panel', show)
  fileToggleBtnEl().classList.toggle('active', show)
}

function togglePanel(): void {
  manualHidden = !manualHidden
  localStorage.setItem('file-panel-hidden', manualHidden ? '1' : '0')
  updatePanelVisibility()
}

function renderFileList(files: import('../preload/index').SiblingFile[]): void {
  const list = fileListEl()
  list.innerHTML = ''
  for (const f of files) {
    const li = document.createElement('li')
    const btn = document.createElement('button')
    btn.textContent = f.name
    btn.title = f.name
    btn.dataset.path = f.path
    if (f.path === currentFilePath) btn.classList.add('active')
    li.appendChild(btn)
    list.appendChild(li)
  }
}

async function refreshSiblings(): Promise<void> {
  const files = await window.electronAPI.listSiblings()
  if (files) renderFileList(files)
}

function enterSourceMode(content: string): void {
  sourceModeActive = true
  editorEl().classList.add('hidden')
  const ta = sourceEl()
  ta.classList.add('visible')
  ta.value = content
  slidesBtnEl().classList.add('visible')
}

function exitSourceMode(): void {
  sourceModeActive = false
  editorEl().classList.remove('hidden')
  sourceEl().classList.remove('visible')
  slidesBtnEl().classList.remove('visible')
}

function setContent(content: string): void {
  if (isSlidesContent(content)) {
    enterSourceMode(content)
  } else {
    try {
      exitSourceMode()
      setMarkdown(content)
    } catch {
      // Keep a document accessible even when the rich editor cannot parse an
      // unusual or exceptionally large Markdown structure.
      enterSourceMode(content)
    }
  }
}

function removeFileFromList(filePath: string): void {
  const button = fileListEl().querySelector(`button[data-path="${CSS.escape(filePath)}"]`)
  button?.closest('li')?.remove()
}

async function closeCurrentDocument(): Promise<void> {
  if (!currentFilePath) return
  if (dirty && !window.confirm('当前文件有未保存的修改，关闭后将丢失这些修改。是否继续？')) return
  if (!await window.electronAPI.closeCurrentDocument()) return
  removeFileFromList(currentFilePath)
  currentFilePath = null
  exitSourceMode()
  applyContent(defaultContent)
  setDirtyState(false)
  updatePanelVisibility()
}

function getContent(): string {
  if (sourceModeActive) return sourceEl().value
  return getMarkdown()
}

async function init(): Promise<void> {
  const api = window.electronAPI
  document.body.classList.add(`platform-${api.platform}`)
  const savedTheme = loadSavedTheme()
  applyTheme(savedTheme)
  loadSavedFont()

  if (savedTheme.startsWith('custom:')) {
    const fileName = savedTheme.slice(7)
    const css = await api.loadThemeCSS(fileName)
    if (css) applyTheme(savedTheme, css)
  }

  const searchPanel = new SearchPanel()
  api.onSearch(() => searchPanel.show())
  api.onMathModal(() => showMathModal())

  await createEditor('editor', () => {
    if (Date.now() >= applyingUntil) {
      setDirtyState(true)
      scheduleAutoSave()
    }
  })

  sourceEl().addEventListener('input', () => {
    if (!sourceModeActive || Date.now() < applyingUntil) return
    setDirtyState(true)
    scheduleAutoSave()
  })

  // File panel: switch to a sibling file (confirm if there are unsaved edits)
  fileListEl().addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest('button[data-path]') as HTMLButtonElement | null
    if (!btn || !btn.dataset.path) return
    if (btn.dataset.path === currentFilePath) return
    if (dirty && !window.confirm('当前文件有未保存的修改，切换文件会丢失这些修改。是否继续？')) return
    await api.openSibling(btn.dataset.path)
  })
  fileListEl().addEventListener('contextmenu', (e) => {
    const btn = (e.target as HTMLElement).closest('button[data-path]') as HTMLButtonElement | null
    if (!btn?.dataset.path || btn.dataset.path !== currentFilePath) return
    e.preventDefault()
    api.showFileListContextMenu(btn.dataset.path)
  })

  fileToggleBtnEl().addEventListener('click', togglePanel)
  api.onToggleFilePanel(() => togglePanel())

  api.onSiblingsChanged((files) => renderFileList(files))
  updatePanelVisibility()

  // Slides button — open as slides
  slidesBtnEl().addEventListener('click', () => api.openAsSlides(getContent()))

  api.onMenuOpen(async () => {
    // 'file-opened' event drives the content load (and file-panel refresh)
    await api.openFile()
  })

  api.onMenuSave(async () => {
    const ok = await api.saveFile(getContent())
    if (ok) setDirtyState(false)
  })
  api.onMenuSaveAs(async () => {
    const ok = await api.saveFileAs(getContent())
    if (ok) setDirtyState(false)
  })
  api.onMenuSaveAndClose(async () => {
    const ok = await api.saveFile(getContent())
    if (!ok) return
    setDirtyState(false)
    api.closeWindowAfterSave()
  })
  api.onMenuExportPDF(() => api.exportPDF())

  api.onMenuCloseCurrentDocument(() => {
    void closeCurrentDocument()
  })
  api.onNewFile(() => {
    // New documents reuse the current window. Closing an open document first
    // also removes it from the file panel without touching the file on disk.
    if (currentFilePath) {
      void closeCurrentDocument()
      return
    }
    exitSourceMode()
    applyContent(defaultContent)
    setDirtyState(false)
  })
  api.onFileOpened((data) => {
    currentFilePath = data.path
    setDirtyState(false)
    markApplying()
    setContent(data.content)
    updatePanelVisibility()
    refreshSiblings()
  })
  api.onFileChanged((content) => {
    markApplying()
    if (sourceModeActive) {
      sourceEl().value = content
    } else {
      setMarkdown(content)
    }
    setDirtyState(false)
  })
  api.onSetTheme((theme) => applyTheme(theme))
  api.onSetFont((fontFamily) => applyEditorFont(fontFamily))
  api.onShowFontSettings(() => { void showFontSettings() })
  api.onSetCustomCSS((css) => {
    const theme = loadSavedTheme()
    applyTheme(theme, css)
  })

  api.onMenuNewSlides(async () => {
    await api.newSlides()
  })

  api.onNewSlidesContent((content) => {
    enterSourceMode(content)
  })

  api.onMenuOpenAsSlides(async () => {
    await api.openAsSlides(getContent())
  })

  api.onMenuExportSlides(async () => {
    await api.exportSlides(getContent())
  })

  api.onMenuImportTheme(async () => {
    const result = await api.loadCustomTheme()
    if (result) applyTheme(`custom:${result.name}`, result.css)
  })

  api.onAgentActivity((state) => {
    if (state === 'active' || state === 'cooldown' || state === 'idle') {
      agentActivityState = state
      updateStatusDot()
    }
  })

  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', async (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files[0]
    if (!file) return
    const filePath = api.getPathForFile(file)
    if (!filePath) return
    const result = await api.openFilePath(filePath)
    // 'file-opened' event drives the content load when opened into this window
    void result
  })
}

init().catch((e) => console.error('ColaMD init failed:', e))
