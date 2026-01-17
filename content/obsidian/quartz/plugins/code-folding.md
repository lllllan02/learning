---
title: 折叠代码块插件
tags:
  - Quartz
  - Markdown
  - 代码块
date: 2026-01-16
order: 5
---

## 功能介绍

本文记录了为 Quartz 4 定制的“代码折叠”功能。通过使用自定义插件 `CodeFold`，实现了以下核心增强：

1.  **快速折叠**：通过简单的 `fold` 关键字收纳冗长的代码块。
2.  **自定义标题**：支持通过 `fold="标题"` 指定折叠条文本。
3.  **兼容原有语法**：自动识别 `title="..."` 属性并将其作为折叠标题。
4.  **样式自加载**：插件会自动注入所需的 CSS，实现真正的即插即用。

### 使用示例

在代码块的语言声明后添加 `fold` 关键字：

#### 1. 默认折叠
````markdown
```ts fold
console.log("这段代码默认是收起的");
```
````

```ts fold
console.log("这段代码默认是收起的");
```

#### 2. 自定义标题
使用 `fold="..."` 直接指定：
````markdown
```python fold="查看完整的爬虫脚本"
import requests
# ... 很多代码 ...
```
````

```python fold="查看完整的爬虫脚本"
import requests
# ... 很多代码 ...
```

#### 3. 兼容原有标题语法
如果已使用 `title="..."` 且包含 `fold`，插件会自动识别 `title` 内容：
````markdown
```js title="config.js" fold
const api_key = "secret_key"
```
````

```js title="config.js" fold
const api_key = "secret_key"
```

---

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **插件核心**：[`CodeFold.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/CodeFold.ts)
2.  **视觉样式**：[`styles/code-fold.scss`](https://github.com/lllllan02/blog/blob/main/quartz/custom/styles/code-fold.scss)
3.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则无需重复下载)

### 启用插件

在 `quartz.config.ts` 的 `transformers` 数组中启用 `Custom.CodeFold`：

```typescript
import * as Custom from "./quartz/custom"

// ...
transformers: [
  Plugin.SyntaxHighlighting(),
  Custom.CodeFold(), // 启用自定义折叠插件
  // ... 其他插件
]
```
