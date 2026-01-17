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
2.  **首页组件**：在首页底部展示最新的待办任务，样式与“最近更新”模块保持高度统一。
3.  **汇总页面**：生成 `/todo` 路由，按状态（未完成优先）和更新时间展示所有任务。
4.  **精准定位**：每条待办事项都带有来源链接，且支持 Quartz 的 Popover 预览功能，悬停即可查看任务所在的文档上下文。
5.  **手动补充**：如果根目录下存在 `content/todo.md`，汇总页会优先展示其中的手动规划内容。

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
2.  **排序逻辑**：汇总页默认将“未完成”项目置顶，相同状态下按文档的更新时间（Modified Date）倒序排列。
3.  **冲突处理**：为了让 `/todo` 路径完全由汇总插件控制，需要确保 `quartz/plugins/emitters/contentPage.tsx` 中跳过了该路径的处理。
