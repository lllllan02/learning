---
title: 图片居中
tags:
  - Quartz
  - 图片
date: 2026-01-16
order: 6
---

本文档记录了 Quartz 中图片布局的自定义修改，主要实现了图片的全局居中显示。

## 图片居中设置

默认情况下，Quartz 中的图片可能是左对齐的。为了提升排版美感，我们在 `quartz/styles/custom.scss` 中添加了全局样式，使文章中的图片自动居中。

### 修改内容

在 `quartz/styles/custom.scss` 文件末尾添加以下 CSS 代码：

```scss
/* quartz/styles/custom.scss */

// 使图片居中显示
img {
  display: block;   // 将图片转换为块级元素
  margin: 0 auto;   // 水平居中
}
```

### 说明

1.  **`display: block`**: 默认情况下图片是行内元素（inline），不支持通过 `margin: 0 auto` 居中。将其改为 `block` 后即可生效。
2.  **`margin: 0 auto`**: 这是 CSS 中经典的块级元素水平居中方法，其中 `0` 表示上下边距，`auto` 表示左右边距自动分配，从而实现居中。
3.  **全局生效**: 该样式会作用于 `article` 标签内的所有图片，确保博客风格统一。

## 局部调整（备选方案）

如果某些特定图片不希望居中，可以在 Markdown 中使用 HTML 标签包裹：

```markdown
<div style="text-align: left;">
  ![[example.png]]
</div>
```
