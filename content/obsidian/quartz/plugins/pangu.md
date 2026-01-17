---
title: 中英文自动空格插件
tags:
  - Quartz
  - Plugin
  - Custom
date: 2026-01-17
order: 8
---

为了提升阅读体验，我为 Quartz 编写了一个自定义 Transformer 插件，用于在中文和英文/数字之间自动添加空格。

## 插件实现

插件存放在 `quartz/custom/Pangu/index.ts`。它的核心逻辑分为两部分：

1.  **节点内处理**：使用 `mdast-util-find-and-replace` 对单个文本节点内的中英文边界进行正则替换。
2.  **跨节点处理**：使用 `unist-util-visit` 遍历所有节点，检查相邻节点（如文本节点与链接节点）的边界是否需要补全空格。

这种结合方式确保了无论是纯文本还是包含链接、加粗等语法的复杂行内内容，都能获得一致的空格体验。

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **插件文件夹**：[`Pangu/`](https://github.com/lllllan02/blog/tree/main/quartz/custom/Pangu)
2.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

1. 在 `quartz.config.ts` 的 `transformers` 数组中添加：
```typescript
Custom.Pangu(),
```

## 注意事项

1.  **回调函数**：`mdast-util-find-and-replace` 的替换参数如果是字符串（如 `"$1 $2"`），并不会像原生 `String.prototype.replace` 那样解析捕获组。因此必须使用**回调函数**的形式。
2.  **跨节点处理**：单纯使用 `mdast-util-find-and-replace` 只能处理单个文本节点内部的情况。如果中英文被链接、加粗等 Markdown 语法分隔开（属于不同的 MDAST 节点），则需要配合 `unist-util-visit` 检查相邻节点的边界。
3.  **类型兼容性**：在 `visit` 的回调中，`parent` 的类型建议声明为 `any` 以避免复杂的 unist 类型推导冲突，同时应确保进行了 `!parent` 的空值检查。
