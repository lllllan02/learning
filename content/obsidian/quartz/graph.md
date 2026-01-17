---
title: 自定义关系图谱插件
draft: false
tags:
  - Obsidian
  - Quartz
  - 图谱
date: 2026-01-15
order: 2
---

## 功能介绍

本文记录了对 Quartz 关系图谱进行的深度定制与功能增强。通过应用自定义组件 `Graph`，我们在保留官方核心功能的基础上，实现了以下核心增强：

1.  **局部图谱全屏化**：图谱右上角新增“全屏放大”按钮，方便查阅复杂的关系网。
2.  **动态标签切换**：全屏模式下支持通过开关一键开启或隐藏图谱中的 `#标签` 节点。
3.  **智能深度调节**：支持通过 `- / +` 按钮手动调节图谱深度，程序会自动探测连通极限以防止无效操作。
4.  **视觉调优**：优化了节点半径、文字显现效果以及不同视口（移动端/桌面端）下的 UI 自适应。

---

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **组件核心**：[`Graph.tsx`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Graph.tsx)
2.  **交互算法**：[`scripts/graph.inline.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/scripts/graph.inline.ts)
3.  **视觉样式**：[`styles/graph.scss`](https://github.com/lllllan02/blog/blob/main/quartz/custom/styles/graph.scss)
4.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

在布局文件 `quartz.layout.ts` 中，将原有的 `Component.Graph` 替换为 `Custom.Graph`：

```typescript
import * as Custom from "./quartz/custom"

// ...
right: [
  // ... 其他组件
  Custom.Graph(),
],
```
