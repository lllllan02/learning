---
title: 反向链接优化
tags:
  - Quartz
  - 反向链接
date: 2026-01-15
order: 3
---

本文记录了对 Quartz 反向链接（Backlinks）进行的深度定制。通过创建自定义组件 `CustomBacklinks`，我们实现了点击反向链接时能直接定位到源文档中**具体引用当前页面**的位置，并在鼠标悬停时利用 Popover 机制自动预览引用上下文。

## 实现逻辑

该功能的实现分为插件层的数据记录和组件层的链接拼接两部分：

### 1. 插件层：记录引用位置
我们通过创建自定义链接转换插件 `quartz/plugins/transformers/custom-links.ts` 来增强原生功能：
- **生成锚点**：在解析 Markdown 时，为每一个指向内部页面的链接生成唯一的 ID（如 `backlink-0`）。
- **元数据记录**：将这些锚点 ID 记录在文件的 `backlinksMetadata` 中，供后续组件调用。

为了启用该插件，我们需要：
1. 在 `quartz/plugins/transformers/index.ts` 中导出它。
2. 在 `quartz.config.ts` 中将 `Plugin.CrawlLinks` 替换为 `Plugin.CustomCrawlLinks`：

```typescript
// quartz.config.ts
transformers: [
  // ... 其他插件
  Plugin.CustomCrawlLinks({ markdownLinkResolution: "shortest" }),
],
```

### 2. 组件层：精准链接拼接
在自定义组件 `CustomBacklinks` 中，系统会读取源文件的元数据：
- **匹配锚点**：从 `backlinksMetadata` 中提取出指向当前页面的第一个锚点 ID。
- **构建 URL**：在反向链接的 URL 后自动拼接该锚点（如 `source-page#backlink-0`）。

## 维护建议

### 1. 组件与插件注册
在对应的索引文件中导出自定义功能：

```typescript
// quartz/components/index.ts 导出组件
export { ..., CustomBacklinks }

// quartz/plugins/transformers/index.ts 导出插件
export { ..., CustomCrawlLinks }
```

### 2. 布局与配置应用
分别在 `quartz.layout.ts` 和 `quartz.config.ts` 中应用：

```typescript
// quartz.layout.ts
Component.CustomBacklinks()

// quartz.config.ts
Plugin.CustomCrawlLinks()
```

### 3. 相关文件
所有增强逻辑已封装或同步至以下位置：
- [quartz/components/CustomBacklinks.tsx](https://github.com/lllllan02/blog/blob/main/quartz/components/CustomBacklinks.tsx)
- [quartz/plugins/transformers/custom-links.ts](https://github.com/lllllan02/blog/blob/main/quartz/plugins/transformers/custom-links.ts) (自定义插件层)

通过这种方式，官方的 `Backlinks.tsx` 和 `links.ts` 均保持原样，实现了完全的解耦。

## 4. 遗留问题

虽然目前的预览效果非常理想，但实际的点击跳转（Scroll into view）仍存在以下优化空间：

1.  **浏览器默认对齐问题**：浏览器默认会将带 ID 的元素对齐到视口最顶端。如果引用位置位于段落中间，跳转后该行文字会紧贴顶部，导致丢失上方的上下文感。
2.  **图片加载干扰**：如果源文档中包含大量图片且未设置固定高度，页面在滚动时若图片尚未完全加载，会导致最终定位偏差。
3.  **多处引用处理**：目前反向链接默认仅跳转到该文件内“第一次”引用的位置。如果一个文件多次引用了当前页，侧边栏的反向链接无法区分。
4.  **SPA 路由竞争**：在开启 SPA 模式时，Quartz 的滚动处理与浏览器的原生锚点跳转有时会产生冲突，导致滚动不够平滑或瞬间跳变。
