---
title: 自定义标注插件
tags:
  - Quartz
  - Markdown
  - 标注
date: 2026-01-16
order: 6
---

## 功能介绍

本文记录了为 Quartz 4 深度定制的 **Callout（标注）** 插件。该插件在保持与 Obsidian 原生标注样式高度一致的前提下，实现了以下核心增强：

1.  **容器化语法**：引入 `:::` 块级语法，解决了原生标注每行都需要添加 `> ` 的书写痛点。
2.  **无限层级嵌套**：支持通过不同数量的冒号实现清晰的容器嵌套。
3.  **原生折叠动画**：完美适配 Quartz 的折叠脚本，支持默认展开 `+` 或默认折叠 `-`。
4.  **动态样式定制**：支持在 Markdown 中直接为单个标注指定自定义 SVG 图标和 Hex 配色。

---

## 语法指南

### 1. 基础用法
使用 `:::[!类型] 标题` 的标准语法。该插件完整支持以下 12 种基础类型：

:::[!info]- 基础类型
| 类型 | 别名 | 默认颜色 | 默认图标 |
| :--- | :--- | :--- | :--- |
| `note` | - | 蓝色 | ![](https://api.iconify.design/lucide:pencil.svg?color=%23448aff) |
| `abstract` | `summary`, `tldr` | 浅蓝色 | ![](https://api.iconify.design/lucide:clipboard-list.svg?color=%2300b0ff) |
| `info` | - | 蓝绿色 | ![](https://api.iconify.design/lucide:info.svg?color=%2300b8d4) |
| `todo` | - | 蓝绿色 | ![](https://api.iconify.design/lucide:check-square.svg?color=%2300b8d4) |
| `tip` | `hint`, `important` | 绿色 | ![](https://api.iconify.design/lucide:flame.svg?color=%2300bfa5) |
| `success` | `check`, `done` | 绿色 | ![](https://api.iconify.design/lucide:check.svg?color=%2309ad7a) |
| `question` | `help`, `faq` | 橙色 | ![](https://api.iconify.design/lucide:help-circle.svg?color=%23dba642) |
| `warning` | `attention`, `caution` | 橙黄色 | ![](https://api.iconify.design/lucide:alert-triangle.svg?color=%23db8942) |
| `failure` | `missing`, `fail` | 红色 | ![](https://api.iconify.design/lucide:x.svg?color=%23db4242) |
| `danger` | `error` | 红色 | ![](https://api.iconify.design/lucide:zap.svg?color=%23db4242) |
| `bug` | - | 红色 | ![](https://api.iconify.design/lucide:bug.svg?color=%23db4242) |
| `example` | - | 紫色 | ![](https://api.iconify.design/lucide:list.svg?color=%237a43b5) |
| `quote` | `cite` | 灰色 | ![](https://api.iconify.design/lucide:quote.svg?color=%239e9e9e) |
:::

**代码：**
```markdown
:::[!note] 笔记标题
这里是内容，可以直接写多行。
不需要每行都加 > 符号。
:::
```

**效果：**
:::[!note] 笔记标题
这里是内容，可以直接写多行。
不需要每行都加 > 符号。
:::

### 2. 折叠控制
在类型后缀添加 `+` 或 `-`（需放在方括号内）。

**代码：**
```markdown
:::[!info]- 点击展开查看秘密
这是一个默认折叠的标注。
:::
```

**效果：**
:::[!info]- 点击展开查看秘密
这是一个默认折叠的标注。
:::

### 3. 嵌套标注
外层标注使用更多的冒号（如 `::::`）包裹内层标注（如 `:::`）。

**代码：**
```markdown
::::[!question] 这是一个复杂的问题
内部可以包含普通文本。

:::[!todo] 内部的任务
- [ ] 任务一
- [ ] 任务二
:::

::::
```

**效果：**
::::[!question] 这是一个复杂的问题
内部可以包含普通文本。

:::[!todo] 内部的任务
- [ ] 任务一
- [ ] 任务二
:::

::::

### 4. 纯标题标注
该插件支持不带主体内容的标注，非常适合作为精美的“标签”或“状态栏”使用。

**代码：**
```markdown
:::[!info] 纯标题标注示例
:::
```

**效果：**
:::[!info] 纯标题标注示例
:::

### 5. 自定义图标与颜色
该插件支持灵活的智能识别语法：`:::[!类型|颜色] 标题`。

> [!tip] 规范说明
> - **类型 (Type)**：可以是标准名称（如 `tip`），也可以直接是一个 **图标 URL**。
> - **颜色 (Color)**：以 `#` 开头的 Hex 值，用于一键设置整个标注的主题色。
> - **方括号**：必须使用 `[!...]` 格式以对齐 Obsidian 的心智模型。

**代码：**
```markdown
:::[!https://api.iconify.design/lucide:rocket.svg|#a855f7] 深度定制
- **规范语法**：必须使用 `:::[!图标URL|颜色] 标题`。
:::

:::[!tip|#ff0000] 红色警告
即使是标准类型，也可以直接加 `|颜色` 来覆盖。
:::
```

**效果：**
:::[!https://api.iconify.design/lucide:rocket.svg|#a855f7] 深度定制
- **规范语法**：必须使用 `:::[!图标URL|颜色] 标题`。
:::

:::[!tip|#ff0000] 红色警告
即使是标准类型，也可以直接加 `|颜色` 来覆盖。
:::

---

## 如何使用

### 下载文件

请确保以下文件已保存至项目的 `quartz/custom/` 对应位置：

1.  **转换插件**：[`Callout.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/Callout.ts)
2.  **独立样式**：[`styles/callout.scss`](https://github.com/lllllan02/blog/blob/main/quartz/custom/styles/callout.scss)
3.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则直接添加导出语句)

### 启用插件

在 `quartz.config.ts` 中注册该 Transformer 插件：

```typescript
import * as Custom from "./quartz/custom"

// ...
transformers: [
  // ... 其他插件
  Custom.Callout(), 
  // 建议放在 ObsidianFlavoredMarkdown 之前
],
```
