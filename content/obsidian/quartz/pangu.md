---
title: 自定义中英文空格插件
tags:
  - Quartz
  - Plugin
  - Custom
date: 2026-01-17
order: 8
---

为了提升阅读体验，我为 Quartz 编写了一个自定义 Transformer 插件，用于在中文和英文/数字之间自动添加空格。

## 插件实现

插件存放在 `quartz/custom/Pangu.ts`。它利用 `mdast-util-find-and-replace` 在 Markdown 解析阶段对文本节点进行正则替换。

```typescript
import { QuartzTransformerPlugin } from "../plugins/types"
import { Root } from "mdast"
import { findAndReplace as mdastFindReplace } from "mdast-util-find-and-replace"

export const Pangu: QuartzTransformerPlugin = () => {
  return {
    name: "Pangu",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root) => {
            mdastFindReplace(tree, [
              [
                /([\u4e00-\u9fa5])([a-zA-Z0-9])/g,
                (_value: string, p1: string, p2: string) => `${p1} ${p2}`,
              ],
              [
                /([a-zA-Z0-9])([\u4e00-\u9fa5])/g,
                (_value: string, p1: string, p2: string) => `${p1} ${p2}`,
              ],
            ])
          }
        },
      ]
    },
  }
}
```

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **插件核心**：[`Pangu.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Pangu.ts)
2.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

1. 在 `quartz.config.ts` 的 `transformers` 数组中添加：
   ```typescript
   Custom.Pangu(),
   ```

## 注意事项

在实现过程中发现，`mdast-util-find-and-replace` 的替换参数如果是字符串（如 `"$1 $2"`），并不会像原生 `String.prototype.replace` 那样解析捕获组。因此必须使用**回调函数**的形式来实现正确的替换。
