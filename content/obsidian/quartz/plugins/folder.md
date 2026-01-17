---
title: 文件树插件
tags:
  - Quartz
  - 文件夹
date: 2026-01-15
order: 1
---

## 功能介绍

本文记录了对 Quartz 文件树（Explorer）进行的深度定制。通过应用自定义组件 `Explorer`，我们实现了以下核心增强：

1.  **屏蔽空文件夹页面**：若文件夹不含 `index.md`，在文件树中点击时仅触发展开/折叠，不再跳转到空白的自动生成目录页。
2.  **内置自定义排序**：支持通过 `order` 属性精准控制显示顺序。
3.  **一键展开/折叠**：在标题旁新增切换按钮，支持一键展开或折叠所有文件夹，状态会自动记忆。

### 自定义排序

现在，你可以直接在 Markdown 文件的 Frontmatter 中通过 `order` 属性来控制它在文件树中的位置：

```markdown
---
title: 某篇笔记
order: 1  # 数值越小越靠前
---
```

### 排序规则
组件内部集成了以下逻辑：
1.  **显式排序优先**：拥有 `order` 属性的项始终排在没有该属性的项之前。
2.  **数值排序**：按 `order` 数值升序排列。
3.  **回退机制**：若 `order` 相同或缺失，则回退到默认的“文件夹在前 + 字母顺序（支持自然数排序）”排列。

### 一键展开/折叠

在文件树标题右侧新增了一个动态按钮：
- **图标指示**：按钮图标会根据当前状态变化。当存在折叠文件夹时显示“带加号的文件夹”图标，当全部展开后显示“带减号的文件夹”图标。
- **状态感应**：点击按钮将根据当前状态自动切换（若未全开则全开，若已全开则全收）。
- **持久化**：操作结果会同步到浏览器的 `localStorage` 中，刷新页面也能保持你的展开偏好。

---

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **组件文件夹**：[`Explorer/`](https://github.com/lllllan02/blog/tree/main/quartz/custom/Explorer)
4.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

在布局文件中，将原有的 `Component.Explorer` 替换为 `Custom.Explorer`：

```typescript
import * as Custom from "./quartz/custom"

// ...
left: [
  // ... 其他组件
  Custom.Explorer(),
],
```
