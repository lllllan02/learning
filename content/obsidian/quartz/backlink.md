---
title: 反向链接优化
tags:
  - Quartz
  - 反向链接
date: 2026-01-15
order: 3
---

## 功能介绍

本文记录了对 Quartz 反向链接（Backlinks）进行的深度定制。通过应用自定义组件 `Backlinks`，我们实现了以下核心增强：

1.  **精准跳转**：点击反向链接时能直接定位到源文档中**具体引用当前页面**的位置。
2.  **上下文预览**：在鼠标悬停时利用 Popover 机制自动预览引用位置的上下文。

## 遗留问题

1.  **浏览器默认对齐问题**：跳转后该行文字会紧贴顶部，有时会丢失上方上下文感。
2.  **图片加载干扰**：大量未设置高度的图片可能导致最终定位偏差。
3.  **SPA 路由竞争**：在开启 SPA 模式时，Quartz 的滚动处理与浏览器的原生锚点跳转有时会产生冲突。

---

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **转换插件**：[`Links.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Links.ts) (负责记录锚点元数据)
2.  **显示组件**：[`Backlinks.tsx`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Backlinks.tsx) (负责精准拼接链接)
3.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

#### 1. 配置转换插件 (quartz.config.ts)
将原生的 `Plugin.CrawlLinks` 替换为自定义的 `Custom.CrawlLinks`：

```typescript
import * as Custom from "./quartz/custom"

// ...
transformers: [
  // ... 其他插件
  Custom.CrawlLinks({ markdownLinkResolution: "shortest" }),
],
```

#### 2. 配置布局组件 (quartz.layout.ts)
将原有的 `Component.Backlinks` 替换为 `Custom.Backlinks`：

```typescript
import * as Custom from "./quartz/custom"

// ...
right: [
  // ... 其他组件
  Custom.Backlinks(),
],
```
