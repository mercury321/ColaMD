import { createEditor, getMarkdown, setMarkdown, showMathModal } from './editor/editor'
import { SearchPanel } from './editor/search-panel'
import { applyTheme, loadSavedTheme } from './themes/theme-manager'
import './themes/base.css'

const FONT_STORAGE_KEY = 'colamd-editor-font'
const CUSTOM_FONT_NAME_KEY = 'colamd-custom-font-name'

function applyEditorFont(fontFamily: string): void {
  const value = fontFamily.trim()
  if (!value) {
    document.documentElement.style.removeProperty('--editor-font-family')
    document.body.classList.remove('has-font-override')
    localStorage.removeItem(FONT_STORAGE_KEY)
    return
  }

  document.documentElement.style.setProperty('--editor-font-family', value)
  document.body.classList.add('has-font-override')
  localStorage.setItem(FONT_STORAGE_KEY, value)
}

function loadSavedFont(): void {
  applyEditorFont(localStorage.getItem(FONT_STORAGE_KEY) || '')
}

function fontStackFromName(fontName: string): string {
  const escaped = fontName.trim().replace(/["\\]/g, '\\$&')
  return `"${escaped}", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif`
}

function showFontSettings(): void {
  if (document.querySelector('.font-modal-overlay')) return

  const overlay = document.createElement('div')
  overlay.className = 'font-modal-overlay'
  overlay.innerHTML = `
    <section class="font-modal" role="dialog" aria-modal="true" aria-labelledby="font-modal-title">
      <h3 id="font-modal-title">自定义正文字体</h3>
      <p>输入电脑中已安装的字体名称，例如“思源宋体”或“霞鹜文楷”。</p>
      <input class="font-modal-input" type="text" autocomplete="off" placeholder="字体名称">
      <div class="font-modal-preview">中文排版预览 · ColaMD 123</div>
      <div class="font-modal-footer">
        <button class="font-modal-btn cancel" type="button">取消</button>
        <button class="font-modal-btn save" type="button">应用</button>
      </div>
    </section>`

  const input = overlay.querySelector('.font-modal-input') as HTMLInputElement
  const preview = overlay.querySelector('.font-modal-preview') as HTMLElement
  const close = (): void => overlay.remove()
  const apply = (): void => {
    const fontName = input.value.trim()
    if (!fontName) return
    localStorage.setItem(CUSTOM_FONT_NAME_KEY, fontName)
    applyEditorFont(fontStackFromName(fontName))
    close()
  }

  input.value = localStorage.getItem(CUSTOM_FONT_NAME_KEY) || ''
  const updatePreview = (): void => {
    preview.style.fontFamily = input.value.trim() ? fontStackFromName(input.value) : ''
  }
  updatePreview()
  input.addEventListener('input', updatePreview)
  overlay.querySelector('.cancel')?.addEventListener('click', close)
  overlay.querySelector('.save')?.addEventListener('click', apply)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
    if (event.key === 'Enter') apply()
  })

  document.body.appendChild(overlay)
  input.focus()
  input.select()
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
// Milkdown's markdownUpdated listener fires 200ms-debounced AFTER a doc change,
// so a programmatic load would spuriously mark the doc dirty unless we keep a
// suppression window long enough to cover that debounce.
let applyingUntil = 0
let manualHidden = localStorage.getItem('file-panel-hidden') === '1'

function markApplying(): void {
  applyingUntil = Date.now() + 350
}

function applyContent(content: string): void {
  markApplying()
  setContent(content)
}

function updatePanelVisibility(): void {
  const show = currentFilePath !== null && !manualHidden
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
    exitSourceMode()
    setMarkdown(content)
  }
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
    if (Date.now() >= applyingUntil) dirty = true
  })

  // File panel: switch to a sibling file (confirm if there are unsaved edits)
  fileListEl().addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest('button[data-path]') as HTMLButtonElement | null
    if (!btn || !btn.dataset.path) return
    if (btn.dataset.path === currentFilePath) return
    if (dirty && !window.confirm('当前文件有未保存的修改，切换文件会丢失这些修改。是否继续？')) return
    await api.openSibling(btn.dataset.path)
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
    if (ok) dirty = false
  })
  api.onMenuSaveAs(async () => {
    const ok = await api.saveFileAs(getContent())
    if (ok) dirty = false
  })
  api.onMenuExportPDF(() => api.exportPDF())

  api.onNewFile(() => { exitSourceMode(); applyContent('') })
  api.onFileOpened((data) => {
    currentFilePath = data.path
    dirty = false
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
    dirty = false
  })
  api.onSetTheme((theme) => applyTheme(theme))
  api.onSetFont((fontFamily) => applyEditorFont(fontFamily))
  api.onShowFontSettings(() => showFontSettings())
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

  const agentDot = document.getElementById('agent-dot')
  api.onAgentActivity((state) => {
    if (agentDot) agentDot.className = state === 'idle' ? '' : state
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
