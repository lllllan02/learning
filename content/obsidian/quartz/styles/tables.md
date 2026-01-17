---
title: 表格自动最大宽度
tags:
  - Obsidian
  - Quartz
  - 表格
date: 2026-01-17
---

Quartz 默认的表格样式在列数较少时可能不会铺满整个正文区域。通过简单的 CSS 配置，可以让表格自动撑满最大宽度。

## 配置方案

在 `quartz/styles/custom.scss` 中添加以下代码：

```scss
// 表格样式优化：自动铺满最大宽度
.table-container {
  & > table {
    width: 100%;      // 强制表格宽度为 100%
    margin-left: 0;   // 移除默认边距
    margin-right: 0;  // 移除默认边距
    display: table;   // 确保表格布局模式正确
    table-layout: auto; // 默认根据内容调整列宽
  }
}
```

## 核心配置项说明

1.  **`width: 100%`**: 让表格水平方向撑满父容器。
2.  **`table-layout: auto`**: 这是浏览器的默认行为，单元格宽度会根据内容多少自动分配。
    *   *进阶提示*：如果你希望所有列宽度绝对相等（忽略内容多少），可以将此项改为 `fixed`。
3.  **`.table-container`**: Quartz 为每个 Markdown 表格都包裹了这个类，它自带 `overflow-x: auto`，因此即使在移动端或表格极宽时，也能提供良好的滚动支持，而不会超出页面范围。

## 效果

配置后，所有的 Markdown 表格都将自动延展至页面正文的最大宽度，使布局更加美观整齐。
