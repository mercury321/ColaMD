# ColaMD Mercury定制版

> 一款免费、优雅的 Markdown 编辑器，支持 AI Agent 改动实时同步。

> **ColaMD Mercury定制版**：这是 Mercury321 基于 [marswaveai/ColaMD](https://github.com/marswaveai/ColaMD) 制作的 Fork 版本，包含中文菜单、系统字体选择、字体实时预览和 Windows 界面布局优化。

**Language / 语言: [English](README_EN.md) · [中文](README.md)** · [官网](https://colamd.com/)

Markdown 已经成为 AI 时代写作、记录、文档和协作的事实标准。但很多人的电脑上依然没有一个免费、好看、好用的 Markdown 阅读器/编辑器。

为此我开发了 ColaMD，一款开源、免费、轻量、优雅的 Markdown 编辑器。

它首先是一款简单、专注、好用的 Markdown 编辑器：所见即所得、主题切换、富文本复制、智能换行、PDF 导出，并支持 macOS、Windows 和 Linux。

同时，ColaMD 也是一款对 AI Agent 友好的编辑器。当 Claude Code、Codex、Cola 或其他 Agent 修改正在打开的 `.md` 文件时，ColaMD 会实时同步改动。不需要关闭文件、重新打开，也不需要手动刷新。

上线几个月以来，我们收到了社区热情的反馈。感谢大家提交 Issue、Pull Request，以及参与测试、反馈和讨论的每一位朋友。ColaMD 还在继续成长，欢迎下载体验，也欢迎告诉我们你希望它变成什么样。

我们的目标很明确：把 ColaMD 做成最好用的免费 Markdown 编辑器，也让它成为 AI 时代 Markdown 工作流的一块可靠基础设施。

如果 ColaMD 对你有帮助，欢迎给我们一个 ⭐ Star 支持。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/release/mercury321/colamd.svg)](https://github.com/mercury321/ColaMD/releases)

[下载](#下载) | [功能](#功能) | [开发](#开发)

---

## 功能

- **保留文件列表** — 关闭当前文档后，同目录文件继续留在左侧，可直接点击打开另一篇文档。

- **未命名文档引导** — 关闭当前文档或新建时显示可直接替换的中文写作引导，不再呈现空白编辑页。

- **文档关闭与新建** — 在左侧当前文件上右键可关闭文档（不会删除磁盘文件）；新建空白文档复用当前窗口，不再额外弹出窗口。

- **长文档加载优化** — 合并代码块按钮的渲染扫描，避免长 Markdown 加载时反复遍历；异常内容会保留为源码模式，确保文档可打开。

- **文件打开修复** — Windows 下双击或用文件路径启动 `.md` / `.txt` 文件时，稳定识别并打开文档。

- **上游主题更新** — 新增羊皮纸、简白、熊红、作家、夜航、极地、暖木、德古拉、午夜 9 套内置主题。
- **编辑效率** — 代码块悬停可一键复制；选中文本后按 `Ctrl+B` 可切换加粗。

### Mercury 定制版更新

- **中文菜单** — 文件、编辑、视图、主题、帮助等菜单已完成中文化。
- **系统字体选择** — 读取 Windows 已安装字体，支持搜索和列表选择。
- **字体实时预览** — 通过多行标题、正文、粗体、引用和中英文混排预览字体效果。
- **字体设置记忆** — 应用选择的正文字体会在下次启动时保留。
- **Windows 布局优化** — 移除原生菜单下方多余空白，让编辑区从菜单下方自然开始。
- **最近打开** — 在“文件 → 最近打开”中保留最近使用的 Markdown 文件，最多显示 12 条。
- **启动恢复** — 可选择启动时自动载入上一次打开的文档。
- **默认编辑器入口** — Windows 用户可从“帮助 → 设置为默认 Markdown 编辑器”进入系统设置。

- **实时 Agent 同步** — Claude Code、Cursor、Copilot 或其他 AI Agent 修改文件后，内容实时出现在编辑器中。
- **状态指示器** — 标题栏圆点：未保存时蓝色点亮，保存后熄灭；软件自身保存不会误触发 Agent 提示，Agent 编辑时保留橙色与绿色状态提示。
- **真正的所见即所得** — 输入 Markdown，直接看到富文本，无需分屏预览。
- **同目录文件列表** — 发现并切换当前目录下的 Markdown 文件；Agent 新建或删除文件后自动更新。
- **待办列表** — 直接点击复选框完成任务，也支持快捷键。
- **高亮与 LaTeX** — 使用 `==高亮文本==`，并通过 KaTeX 渲染数学公式。
- **文档搜索** — 使用 ⌘/Ctrl+F 快速查找内容。
- **智能换行** — 单个换行直接渲染为换行，符合人类和 AI 工具写 Markdown 的习惯。
- **富文本复制** — 复制后粘贴到公众号、微信、邮件等富文本编辑器，格式完整保留。
- **主题** — 4 个内置主题、可下载主题，以及自定义 CSS 导入。
- **PDF 导出** — 在需要交付时，将 Markdown 文档导出为 PDF。
- **极简设计** — 没有工具栏，没有永久侧边栏，专注于内容本身。
- **跨平台** — 支持 macOS、Windows 和 Linux。

## 截图

<p align="center">
  <img src="docs/images/mercury-welcome.png" alt="ColaMD Mercury定制版欢迎页" width="49%">
  <img src="docs/images/mercury-recent-files.png" alt="ColaMD Mercury定制版最近打开文件" width="49%">
</p>

<p align="center">
  <img src="docs/images/mercury-help-menu.png" alt="ColaMD Mercury定制版帮助菜单" width="32%">
  <img src="docs/images/mercury-font-menu.png" alt="ColaMD Mercury定制版正文字体菜单" width="32%">
  <img src="docs/images/mercury-font-picker.png" alt="ColaMD Mercury定制版系统字体选择与实时预览" width="32%">
</p>

<p align="center"><em>ColaMD Mercury定制版：版本标识、最近文件、默认编辑器入口、正文预设字体与系统字体多行预览。</em></p>

## 与现有 Markdown 工作流配合

ColaMD 不要求你改变现有习惯，也适合与 Obsidian、Typora、VS Code 等 Markdown 软件配合使用。它们共享同一套 `.md` 文件，你可以用不同工具完成不同任务。

## 下载

> 查看 [Releases](https://github.com/mercury321/ColaMD/releases) 获取 ColaMD Mercury定制版构建。

| 平台 | 格式 |
|------|------|
| macOS | `.dmg` |
| Windows | `.exe` |
| Linux | `.AppImage` / `.deb` |

## ColaMD 不做的事

ColaMD 有意保持简单：

- 没有跨目录文件树或工作区（仅支持打开文件所在目录的 Markdown 文件列表）
- 没有云同步或协作编辑
- 没有内置 AI 功能 — 它是 AI 生成内容的**查看器/编辑器**
- 没有插件系统

一件事，做到极致。

## 自定义主题

ColaMD 支持自定义 CSS 主题。从 [`themes/`](themes/) 文件夹下载主题，或自己创建后通过 **Theme > Import Theme** 导入。

导入的主题会保存到 `~/.colamd/themes/`，重启后仍然可用。

## 开发

```bash
git clone https://github.com/marswaveai/colamd.git
cd colamd
npm install
npm run dev
```

### 构建

```bash
npm run dist:mac
npm run dist:win
npm run dist:linux
```

### 技术栈

- **Electron** — 跨平台桌面
- **Milkdown** — 所见即所得 Markdown（基于 ProseMirror）
- **TypeScript** — 严格模式
- **electron-vite** — 快速构建

## 路线图

ColaMD 将随 Agent 生态一起演进：

- v1.1 — 实时文件热更新、文件关联、拖拽打开、主题系统
- v1.2 — 新图标
- v1.3 — Agent 活动指示器、Cmd+点击链接、富文本复制、智能换行、PDF 导出、主题持久化
- v1.6 — 更稳的实时同步：原子保存（rename）检测、watcher 自愈、关闭拼写检查
- v1.6.1 — 可勾选的待办列表（点击 / ⌘+Enter）、`==高亮==` 语法、Markdown 语法速查
- v1.6.2 — 移除 HTML 导出
- v1.7 — 同目录文件列表：就地切换文件，Agent 新建/删除文件实时更新；搜索（⌘F）+ LaTeX（⌘⇧E），来自社区 PR #14
- v1.7.1 — 待办点击修复、居中的 SVG 对勾、标题栏文件面板开关按钮
- v1.7.2 — 可玩演示页：Help → 新功能演示（⌘⇧D），用真实目录展示每个版本的新功能
- v1.7.3 — 演示页升级为累积式 changelog：resources/demo/changelog.md 记录每个版本，打开即见（当前版本）
- 未来 — 更多模板、双向同步、跨目录文件浏览

## 开源协议

[MIT](LICENSE) — 永久免费。

---

由 [marswave.ai](https://marswave.ai) 为更简单的 Markdown 未来而造。
