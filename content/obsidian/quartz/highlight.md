---
title: 自定义高亮插件
tags:
  - Quartz
  - Plugin
  - Markdown
date: 2026-01-16
order: 4
---

在 Quartz 默认的实现中，当高亮（`==text==`）与维基链接（`[[link]]`）同时存在时（例如 `==[[link]]==`），高亮效果往往会失效，或者链接无法被正确解析。

## 问题原因

1.  **解析顺序问题**：默认插件中链接的解析优先级较高，会将原本连续的文本节点切断，导致后续的高亮正则表达式无法匹配完整的 `==...==` 结构。
2.  **节点类型限制**：默认的高亮插件将匹配内容直接转换为 HTML 字符串（`type: "html"`），这导致其内部的文本无法被后续的 Markdown 转换器（如维基链接插件）进一步处理。

## 解决方案

我们通过在 `quartz/custom` 目录下实现一个自定义的 `Highlight` 插件解决了此问题。

### 1. 实现自定义插件

创建了 `quartz/custom/Highlight.ts`，主要做了两点改进：
- **使用 MDAST 节点**：将高亮内容解析为具有 `children` 的 `textHighlight` 节点，而非纯 HTML。这样内部的链接语法可以被保留并由后续插件处理。
- **类型断言**：通过 `as any` 解决了自定义节点类型在 TypeScript 中的检查问题。

### 2. 调整配置顺序

在 `quartz.config.ts` 中，我们将 `Custom.Highlight()` 放在了 `Plugin.ObsidianFlavoredMarkdown()` 之前，并禁用了原生的 `highlight` 选项：

```typescript
transformers: [
  // ...
  Custom.Highlight(), // 优先处理高亮
  Plugin.ObsidianFlavoredMarkdown({ 
    enableInHtmlEmbed: false, 
    highlight: false // 禁用原生高亮
  }),
  // ...
]
```

## 使用效果与局限性

由于解析顺序的改变（高亮先于链接解析），该补丁对不同写法的支持情况如下：

- **支持** `==[[链接]]==`：高亮会首先包裹整个维基链接，随后维基链接被正确解析。这是最常用的 Obsidian 嵌套语法。
- **不支持** `[[链接|==别名==]]`：由于高亮插件会先运行并切断文本节点，导致维基链接插件无法识别被“切断”后的 `[[...]]` 结构。

> [!important] 注意事项
> 这两种写法在当前插件架构下具有**互斥性**。本定制方案优先保证了 `==[[链接]]==` 这一 Obsidian 原生最常用的高亮嵌套逻辑。

---

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **插件核心**：[`Highlight.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Highlight.ts)
2.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (请确保已在其中导出 `Highlight`)

### 启用插件

在 `quartz.config.ts` 的 `transformers` 数组中启用并配置插件。**注意：`Custom.Highlight()` 必须放在 `Plugin.ObsidianFlavoredMarkdown()` 之前。**

```typescript
import * as Custom from "./quartz/custom"

// ...
transformers: [
  // ...
  Custom.Highlight(), // 启用自定义高亮插件
  Plugin.ObsidianFlavoredMarkdown({ 
    enableInHtmlEmbed: false, 
    highlight: false // 必须禁用原生的 highlight 选项以避免冲突
  }),
  // ...
]
```

这种定制方案保持了对核心代码的零侵入，所有逻辑都封装在 `custom` 文件夹下，便于后续升级。
