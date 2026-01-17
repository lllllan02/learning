---
title: 字体设置
tags:
  - Quartz
  - 字体
  - 霞鹜文楷
date: 2026-01-15
order: 10
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

建议在 `quartz/styles/custom.scss` 中添加覆盖样式。目前的配置使用了 CSS 变量，通过简化选择器并优化间距，提升了长文本的可读性：

```scss
/* quartz/styles/custom.scss */

:root {
  --article-font-size: 1.2rem;   /* 调大正文字号 */
  --article-line-height: 2rem;   /* 调大行间距 */
  --article-margin: 1rem;       /* 增大段落间距 */
  --article-h1-size: 1.8rem;
  --article-h2-size: 1.5rem;
  --article-h3-size: 1.35rem;
  --article-h4-size: 1.25rem;
}

article {
  font-size: var(--article-font-size);
  line-height: var(--article-line-height);

  // 标题间距与大小
  h1 { font-size: var(--article-h1-size); margin-top: 1.8rem; }
  h2 { font-size: var(--article-h2-size); margin-top: 1.6rem; }
  h3 { font-size: var(--article-h3-size); margin-top: 1.4rem; }
  h4 { font-size: var(--article-h4-size); margin-top: 1.2rem; }

  // 块级元素间距
  p, ul, ol, dl, blockquote {
    margin: var(--article-margin) 0;
  }

  // 列表项保持紧凑
  li {
    margin: 0.3rem 0;
  }

  // 加粗字体对比度优化
  strong {
    font-weight: 700;
    color: var(--dark);
    text-shadow: 0.2px 0 currentColor; // 模拟更粗的效果
    padding: 0 1px;
  }

  // 马克笔效果（用于下划线语法）
  u {
    text-decoration: none; // 移除默认下划线
    background: linear-gradient(transparent 65%, var(--textHighlight) 65%);
    padding: 0 1px;
  }
}
```

## 加粗与下划线优化

为了提升阅读体验，在 `quartz/styles/custom.scss` 中对字体样式进行了如下优化：

### 加粗字体 (Strong)
由于“霞鹜文楷”字体的粗体视觉差异较小：
1. **增加字重**：显式设置 `font-weight: 700`。
2. **模拟厚度**：通过 `text-shadow` 增加视觉厚度。
3. **颜色强化**：使用更深的 `var(--dark)`。

### 下划线/马克笔 (Underline)
将原本的“马克笔”高亮效果移植到了下划线语法 (`<u>` 标签) 上：
1. <u>移除默认线条</u>：去掉原生的细下划线。
2. <u>马克笔高亮</u>：添加占比约 35% 的**青蓝色**底色（Cyan），形成类似荧光笔标注的效果。使用青蓝色是为了与 `==黄色高亮==` 语法进行视觉区分。
