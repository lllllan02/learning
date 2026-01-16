---
title: 折叠代码块
tags:
  - Quartz
  - Markdown
  - 代码块
date: 2026-01-16
order: 4
---

本文记录了为 Quartz 4 定制的“代码折叠”功能。通过新建独立的 Transformer 插件，我们实现了在不破坏官方核心源码的前提下，通过简单的 `fold` 关键字即可收纳冗长的代码块。

## 使用方法

现在你只需要在代码块的语言声明后添加 `fold` 关键字即可实现折叠效果。

### 1. 默认折叠
默认显示的标题为“点击展开代码”。

````markdown
```ts fold
console.log("这段代码默认是收起的");
```
````

```ts fold
console.log("这段代码默认是收起的");
```

### 2. 自定义折叠标题
通过 `fold="你的标题"` 来指定折叠条上显示的文本。

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

### 3. 兼容原有标题语法
如果你使用了 `title="..."` 且包含 `fold`，插件会自动将 `title` 识别为折叠条标题。

````markdown
```js title="config.js" fold
const api_key = "secret_key"
```
````

```js title="config.js" fold
const api_key = "secret_key"
```

---

## 实现逻辑

该功能基于 Remark 抽象语法树（AST）转换实现，确保了在 Markdown 转换为 HTML 的早期阶段就完成包装：

1.  **节点拦截**：插件会扫描所有的 `code` 类型节点。
2.  **正则匹配**：使用严格的正则表达式 `/(?:^|\s)fold(?:="([^"]+)")?(?:\s|$)/` 匹配 `fold` 关键字，有效避免误伤标题内部包含的 fold 单词。
3.  **结构包装**：将匹配到的代码节点动态包装进 HTML5 原生的 `<details>` 和 `<summary>` 容器中。

---

## 维护建议

为了保持系统核心代码的纯净，该功能采用了完全解耦的设计模式。

### 1. 插件注册与应用
在 `quartz/plugins/transformers/index.ts` 中完成导出，并在 `quartz.config.ts` 中启用：

```typescript
// quartz.config.ts
transformers: [
  Plugin.SyntaxHighlighting(),
  Plugin.CustomCodeFold(), // 启用自定义折叠插件
  // ...
]
```

### 2. 样式管理
在 `quartz/styles/custom.scss` 中引入专用样式表，以保持样式的模块化：

```scss
// quartz/styles/custom.scss
@use "./custom-code-fold.scss";
```

### 3. 相关文件
所有增强逻辑均封装在以下独立文件中，已同步至 GitHub 仓库：
- [quartz/plugins/transformers/custom-code-fold.ts](https://github.com/lllllan02/blog/blob/main/quartz/plugins/transformers/custom-code-fold.ts)：负责 AST 转换的核心逻辑。
- [quartz/styles/custom-code-fold.scss](https://github.com/lllllan02/blog/blob/main/quartz/styles/custom-code-fold.scss)：负责折叠交互与图标动画的样式。

这种“独立插件”模式确保了官方核心代码（如 `syntax.ts`）的纯净，极大地简化了后续跟随官方仓库升级的工作。
