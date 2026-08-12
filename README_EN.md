# ColaMD Mercury CE

> A free, elegant Markdown editor for humans and AI agents — with real-time sync for AI-generated changes.

> **ColaMD Mercury CE**: A Mercury321 Fork of [marswaveai/ColaMD](https://github.com/marswaveai/ColaMD), with Chinese menus, system font selection, live font previews, and improved Windows layout.

**Language / 语言: [English](README_EN.md) · [中文](README.md)** · [Website](https://colamd.com/)

Markdown has become the de facto standard for writing, note-taking, documentation, and collaboration in the age of AI. Yet many computers still don't have a free, beautiful, capable Markdown reader/editor.

That's why I built ColaMD — an open-source, free, lightweight, and elegant Markdown editor.

First and foremost, it is a simple, focused, capable Markdown editor: true WYSIWYG editing, themes, rich-text copy, smart line breaks, PDF export, and support for macOS, Windows, and Linux.

At the same time, ColaMD is friendly to AI agents. When Claude Code, Codex, Cola, or another agent edits an open `.md` file, ColaMD syncs the changes in real time. No closing the file, reopening it, or manual refresh.

Since launching a few months ago, we have received enthusiastic feedback from the community. Thank you to everyone who has submitted Issues and Pull Requests, tested ColaMD, shared feedback, or joined the discussions. ColaMD is still growing — download it, try it, and tell us what you want it to become.

Our goal is clear: make ColaMD the best free Markdown editor, and make it a reliable foundation for Markdown workflows in the age of AI.

If ColaMD is useful to you, please give the project a ⭐ Star.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/mercury321/colamd.svg)](https://github.com/mercury321/ColaMD/releases)

[Download](#download) | [Features](#features) | [Development](#development)

---

## Features

- **Upstream themes** — Adds nine built-in themes: Sepia, Notion, Bear, Writer, Solarized Dark, Nord, Gruvbox, Dracula, and Midnight.
- **Editing efficiency** — Copy code blocks with one click and toggle bold for selected text with `Ctrl+B`.

### Mercury custom edition updates

- **Chinese menus** — File, Edit, View, Theme, and Help menus are localized.
- **System font selection** — Browse, search, and select fonts installed on Windows.
- **Live font preview** — Preview headings, body text, bold text, quotes, and mixed Chinese/English content.
- **Persistent font settings** — The selected body font is remembered between launches.
- **Improved Windows layout** — Removes the redundant blank space below the native menu.
- **Recent files** — Keeps up to 12 recently opened Markdown files under File > Recent Files.
- **Startup restore** — Choose whether to reopen the last document when ColaMD Mercury CE starts.
- **Default editor entry point** — Windows users can open the system default-app settings from Help > Set as Default Markdown Editor.

- **Live Agent Sync** — Changes made by Claude Code, Cursor, Copilot, or other AI agents appear in the editor in real time.
- **Status Indicator** — The titlebar dot is blue for unsaved changes and off after saving. The app's own saves do not trigger the Agent indicator, which retains its orange and green states for external edits.
- **True WYSIWYG Editing** — Type Markdown and see rich text directly. No split-pane preview.
- **Same-Directory File List** — Discover and switch between Markdown files in the current folder. Files created or removed by your agent appear automatically.
- **Task Lists** — Click checkboxes to complete tasks, or use the keyboard shortcut.
- **Highlights & LaTeX** — Write `==highlighted text==` and render mathematical formulas with KaTeX.
- **Search** — Find anything in the current document with ⌘/Ctrl+F.
- **Smart Line Breaks** — Single newlines render as line breaks, matching how people and AI tools write Markdown.
- **Rich Text Copy** — Copy content with formatting preserved into WeChat, email, and other rich-text editors.
- **Themes** — Four built-in themes, downloadable themes, and custom CSS imports.
- **PDF Export** — Turn your Markdown document into a PDF when you need a finished copy.
- **Minimal by Design** — No toolbar, no permanent sidebar, no distractions.
- **Cross-Platform** — Available for macOS, Windows, and Linux.

## Screenshots

<p align="center">
  <img src="docs/images/mercury-welcome.png" alt="ColaMD Mercury CE welcome screen" width="49%">
  <img src="docs/images/mercury-recent-files.png" alt="ColaMD Mercury CE recent files" width="49%">
</p>

<p align="center">
  <img src="docs/images/mercury-help-menu.png" alt="ColaMD Mercury CE Help menu" width="32%">
  <img src="docs/images/mercury-font-menu.png" alt="ColaMD Mercury CE font menu" width="32%">
  <img src="docs/images/mercury-font-picker.png" alt="ColaMD Mercury CE system font picker with live preview" width="32%">
</p>

<p align="center"><em>ColaMD Mercury CE: version label, recent files, default-editor entry, font presets, and system font preview.</em></p>

## Works with your Markdown workflow

ColaMD does not ask you to change your habits. It works well alongside Obsidian, Typora, VS Code, and other Markdown apps — all sharing the same `.md` files, with each tool doing what it does best.

## Download

> Check [Releases](https://github.com/mercury321/ColaMD/releases) for the latest ColaMD Mercury CE builds.

| Platform | Format |
|----------|--------|
| macOS    | `.dmg` |
| Windows  | `.exe` |
| Linux    | `.AppImage` / `.deb` |

## What ColaMD Does NOT Do

ColaMD is intentionally simple:

- No cross-directory file tree or workspace (same-directory Markdown file list only)
- No cloud sync or collaboration
- No AI features built in — it's a **viewer/editor** for AI-generated content
- No plugin system

One thing, done well.

## Custom Themes

ColaMD supports custom CSS themes. Download themes from the [`themes/`](themes/) folder, or create your own and import via **Theme > Import Theme**.

Imported themes are saved to `~/.colamd/themes/` and persist across sessions.

## Development

```bash
git clone https://github.com/marswaveai/colamd.git
cd colamd
npm install
npm run dev
```

### Build

```bash
npm run dist:mac
npm run dist:win
npm run dist:linux
```

### Tech Stack

- **Electron** — Cross-platform desktop
- **Milkdown** — WYSIWYG Markdown (ProseMirror-based)
- **TypeScript** — Strict mode
- **electron-vite** — Fast builds

## Roadmap

ColaMD will evolve alongside the agent ecosystem:

- v1.1 — Live file reload, file associations, drag & drop, themes
- v1.2 — New icon
- v1.3 — Agent activity indicator, Cmd+click links, rich text copy, smart line breaks, PDF export, theme persistence
- v1.6 — Robust live sync: atomic-save (rename) detection, watcher self-recovery, spellcheck off
- v1.6.1 — Editable task lists (click / ⌘+Enter), ==highlight== syntax, Markdown cheatsheet
- v1.6.2 — Remove HTML export
- v1.7 — Same-directory file list: switch files in place, live updates when agents create/remove files; search (⌘F) + LaTeX (⌘⇧E) from community PR #14
- v1.7.1 — Task checkbox click fix, centered SVG checkmark, titlebar file-panel toggle button
- v1.7.2 — Playable demo page: Help → 新功能演示 (⌘⇧D), a real directory showcasing each release's features
- v1.7.3 — Demo page becomes a cumulative changelog: resources/demo/changelog.md records every release, opening straight into it (current)
- Future — More templates, bidirectional sync, cross-directory file browsing

## License

[MIT](LICENSE) — Free forever.

---

Built by [marswave.ai](https://marswave.ai) for a simpler Markdown future.
