---
title: 图片放大插件
tags:
  - Quartz
  - 图片
  - 交互
date: 2026-01-17
order: 7
---

为了提升阅读体验，特别是在查阅技术图表或高分辨率截图时，我们为 Quartz 集成了图片点击放大的功能（Lightbox 效果）。

## 功能特性

- **无缝集成**：点击文章中的任何图片即可进入放大预览模式。
- **平滑动画**：支持缩放和平移的流畅过渡效果。
- **主题适配**：预览背景色会自动适配当前页面的主题色（浅色/深色）。
- **交互友好**：支持点击背景、按下 `Esc` 键或滚动鼠标来关闭预览。

## 技术实现

该功能基于 [medium-zoom](https://github.com/francoischalifour/medium-zoom) 库实现。

### 1. 组件脚本
我们在 `quartz/custom/ImageZoom/imageZoom.inline.ts` 中实现了自动化绑定逻辑。

```typescript
document.addEventListener("nav", async () => {
  const images = document.querySelectorAll("article img")
  if (images.length > 0) {
    // 动态加载库以优化性能
    const { default: mediumZoom } = await import("https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.esm.js")
    mediumZoom(images, {
      background: "var(--light)", // 自动使用当前主题背景色
      margin: 24,
    })
  }
})
```

### 2. Quartz 组件
创建了一个名为 `ImageZoom` 的自定义组件，并在 `quartz.layout.ts` 中全局注册。

```typescript
// quartz.layout.ts
export const sharedPageComponents: SharedLayout = {
  // ... 其他配置
  afterBody: [
    Custom.ImageZoom(), // 注入图片放大功能
    // ...
  ],
}
```

## 使用方法

你不需要在 Markdown 中进行任何额外操作。只要是标准 Markdown 语法插入的图片：

```markdown
![图片描述](path/to/image.png)
```

或者 Obsidian 样式的双链图片：

```markdown
![[image.png]]
```

在页面渲染后，点击图片即可直接放大查看。

---

## 如何使用

### 下载文件

请将以下文件保存至项目的 `quartz/custom/` 对应位置：

1.  **组件文件夹**：[`ImageZoom/`](https://github.com/lllllan02/blog/tree/main/quartz/custom/ImageZoom)
3.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (用于导出自定义组件)

### 启用组件

在 `quartz.layout.ts` 中引入并启用该组件：

```typescript
import * as Custom from "./quartz/custom"

// ...
export const sharedPageComponents: SharedLayout = {
  // ...
  afterBody: [
    Custom.ImageZoom(),
    // ...
  ],
}
```
