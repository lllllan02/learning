---
title: 右侧目录文本截断
tags:
  - Quartz
  - 目录
date: 2026-01-17
---

## 优化背景

在默认样式下，如果右侧目录（TOC）的标题文字过长，可能会导致侧边栏排版混乱或文字非预期换行。为了保持界面的整洁，我们实现了长标题自动截断功能。

## 实现方案

通过 CSS 的 `text-overflow: ellipsis` 属性，当目录或反向链接文本超过容器宽度时，自动显示为 `...`。

在 `quartz/styles/custom.scss` 中添加以下代码：

```scss
// 右侧目录及反向链接文字超过宽度显示省略号
.toc ul, .backlinks ul {
  & > li > a {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
```

## 最终效果

- 右侧目录及反向链接宽度保持固定，不会被长文本撑开。
- 超长文本自动以省略号结尾，保持视觉上的整齐划一。
