---
title: 字体设置
tags:
  - Quartz
  - 字体
  - 霞鹜文楷
date: 2026-01-15
order: 5
---

本文档记录了 Quartz 的字体配置方式，以及当前使用的字体设置。

## 更换字体

字体设置位于 `quartz.config.ts` 文件的 `configuration.theme.typography` 部分。

目前博客使用了 **[霞鹜文楷 (LXGW WenKai)](https://github.com/lxgw/LxgwWenKai)** 系列字体，该字体具有优美的楷体外观，适合中文阅读。

```typescript
// quartz.config.ts
typography: {
  header: "LXGW WenKai TC", // 标题字体
  body: "LXGW WenKai TC",   // 正文字体
  code: "Fira Code",        // 代码字体
},
```

## 字体大小设置

Quartz 的字体大小主要在 SCSS 样式中定义，核心文件为 `quartz/styles/base.scss`。

### 默认字号参考

- **正文**: 默认为 `16px` (1rem)
- **标题**:
  - `h1`: `1.75rem`
  - `h2`: `1.4rem`
  - `h3`: `1.12rem`
- **代码**:
  - 行内代码: `0.9em`
  - 代码块: `0.85rem`

### 如何自定义

建议在 `quartz/styles/custom.scss` 中添加覆盖样式。目前的配置通过统一多种元素的字号和边距，实现了更好的“垂直律动（Vertical Rhythm）”：

```scss
/* quartz/styles/custom.scss */

article {
  &, p, ul, ol, li, dl, blockquote, td, th, dt, dd {
    font-size: 1.2rem; /* 调大正文字号，提升阅读舒适度 */
    line-height: 2rem; /* 调大行间距，避免文字拥挤 */
    margin-top: 0.3rem; /* 统一元素上边距 */
    margin-bottom: 0.3rem; /* 统一元素下边距，使段落和列表间距一致 */
  }
}
```
