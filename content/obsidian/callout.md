---
title: Obsidian 标注
draft: false
tags:
  - Obsidian
  - 标注
aliases:
  - Callouts
---

标注（Callouts）是 Obsidian 提供的一种特殊的块引用语法，用于创建具有视觉样式的提示信息、警告、笔记等。

## 基础语法

```markdown
> [!type] 标题（可选）
> 内容
```

---

## 支持的标注类型

### Note 笔记
**代码：**
```markdown
> [!note] 笔记
> 默认样式，用于普通笔记。
```
**效果：**
> [!note] 笔记
> 默认样式，用于普通笔记。

### Abstract 摘要
别名：`summary`, `tldr`

**代码：**
```markdown
> [!abstract] 摘要
> 用于摘要或简介。
```
**效果：**
> [!abstract] 摘要
> 用于摘要 or 简介。

### Info 信息
**代码：**
```markdown
> [!info] 信息
> 用于提供额外信息。
```
**效果：**
> [!info] 信息
> 用于提供额外信息。

### Todo 待办
**代码：**
```markdown
> [!todo] 待办
> 用于待办事项。
```
**效果：**
> [!todo] 待办
> 用于待办事项。

### Tip 提示
别名：`hint`, `important`

**代码：**
```markdown
> [!tip] 提示
> 用于小技巧、提示或重要事项。
```
**效果：**
> [!tip] 提示
> 用于小技巧、提示或重要事项。

### Success 成功
别名：`check`, `done`

**代码：**
```markdown
> [!success] 成功
> 用于表示成功或已完成。
```
**效果：**
> [!success] 成功
> 用于表示成功或已完成。

### Question 问题
别名：`help`, `faq`

**代码：**
```markdown
> [!question] 问题
> 用于问题、帮助或常见问题解答。
```
**效果：**
> [!question] 问题
> 用于问题、帮助或常见问题解答。

### Warning 警告
别名：`caution`, `attention`

**代码：**
```markdown
> [!warning] 警告
> 用于警告、小心或引起注意。
```
**效果：**
> [!warning] 警告
> 用于警告、小心或引起注意。

### Failure 失败
别名：`fail`, `missing`

**代码：**
```markdown
> [!failure] 失败
> 用于表示失败或缺失。
```
**效果：**
> [!failure] 失败
> 用于表示失败或缺失。

### Danger 危险
别名：`error`

**代码：**
```markdown
> [!danger] 危险
> 用于危险或错误。
```
**效果：**
> [!danger] 危险
> 用于危险或错误。

### Bug 缺陷
**代码：**
```markdown
> [!bug] Bug
> 用于报告 bug 或代码问题。
```
**效果：**
> [!bug] Bug
> 用于报告 bug 或代码问题。

### Example 示例
**代码：**
```markdown
> [!example] 示例
> 用于示例说明。
```
**效果：**
> [!example] 示例
> 用于示例说明。

### Quote 引用
别名：`cite`

**代码：**
```markdown
> [!quote] 引用
> 用于引用他人话语或文献。
```
**效果：**
> [!quote] 引用
> 用于引用他人话语 or 文献。

---

## 进阶用法

### 可折叠标注

在类型后添加 `+`（默认展开）或 `-`（默认折叠）。

**代码：**
```markdown
> [!info]- 点击展开详情
> 这里是隐藏的内容。
```
**效果：**
> [!info]- 点击展开详情
> 这里是隐藏的内容。

### 嵌套标注

**代码：**
```markdown
> [!question] 这是一个问题
> > [!todo] 待办事项
> > - [ ] 确认答案
```
**效果：**
> [!question] 这是一个问题
> > [!todo] 待办事项
> > - [ ] 确认答案
