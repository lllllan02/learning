---
title: 待办事项插件
tags:
  - Quartz
  - Plugin
  - Custom
date: 2026-01-17
order: 9
---

为了更好地管理全站的学习规划和临时任务，我编写了一个 TODO 插件。它可以自动提取全站所有 Markdown 文档中的待办事项，并生成一个汇总页面。

## 插件功能

1.  **自动收集**：通过 Transformer 插件扫描所有文档中的 `- [ ]` 和 `- [x]` 节点。
2.  **属性扩展**：支持通过 `[priority::N]` 设置优先级（1-4），通过 `[created::YYYY-MM-DD]` 设置创建日期。
3.  **智能排序**：汇总页按“未完成 > 优先级 > 创建日期 > 文件更新时间”进行多级排序。
4.  **首页组件**：在首页底部展示最新的待办任务，样式与“最近更新”模块保持高度统一。
5.  **汇总页面**：生成 `/todo` 路由，并以极简风格展示所有任务及其元数据。
6.  **精准定位**：每条待办事项都带有来源链接，且支持 Quartz 的 Popover 预览功能，悬停即可查看任务所在的文档上下文。
7.  **内容隐藏**：插件会自动在原文档渲染时隐藏 `[priority::n]` 等属性文本，保持正文整洁。
8.  **手动补充**：如果根目录下存在 content/[todo.md](/todo)，汇总页会优先展示其中的手动规划内容。

## 语法规范

在任何 Markdown 文档中，您可以像这样书写待办事项：

```markdown
- [ ] 这是一个紧急任务 [priority::1] [created::2026-01-18]
- [ ] 这是一个普通任务 [priority::2]
- [x] 已完成的任务
```

- **优先级**：使用 `[priority::数字]`，数字越小优先级越高（推荐 1-4）。汇总页会显示为 P1、P2 等。
- **创建日期**：使用 `[created::YYYY-MM-DD]`。

这些属性标记在原文档阅读时**不可见**，仅在 `/todo` 汇总页中展示。

## 如何使用

### 下载文件

请将以下文件下载并保存至项目的 `quartz/custom/` 对应位置：

1.  **插件文件夹**：[`Todo/`](https://github.com/lllllan02/blog/tree/main/quartz/custom/Todo)
2.  **统一入口**：[`index.ts`](https://github.com/lllllan02/blog/blob/main/quartz/custom/index.ts) (若已存在则需补充 Todo 相关的导出)

### 启用插件

1.  **配置 Transformers**：在 `quartz.config.ts` 中添加：
    ```typescript
    Custom.TodoTransformer(),
    ```
2.  **配置 Emitters**：在 `quartz.config.ts` 中添加：
    ```typescript
    Custom.TodoEmitter(),
    ```
3.  **配置布局**：在 `quartz.layout.ts` 的 `afterBody` 中添加组件：
    ```typescript
    Component.ConditionalRender({
      component: Custom.RecentTodo({
        title: "最新待办",
        limit: 1,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    ```

## 注意事项

1.  **ID 冲突**：插件会根据每个文件中的 TODO 数量自动生成 ID（如 `todo-1`）。由于每个文件的计数是独立的，跨文件可能会有重复的 ID，但通过结合文件 Slug（`#todo-1`），在页面定位和预览时是唯一的。
2.  **排序逻辑**：汇总页采用多级排序：状态（未完成优先） > 优先级（P1 > P2...） > 创建时间（新 > 旧） > 文档更新时间。
3.  **冲突处理**：为了让 `/todo` 路径完全由汇总插件控制，需要确保 `quartz/plugins/emitters/contentPage.tsx` 中跳过了该路径的处理。
