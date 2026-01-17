---
title: 插件功能
tags:
  - Obsidian
  - Quartz
date: 2026-01-17
order: 3
---

本章节主要包含以下深度定制的增强插件：

## [[/obsidian/quartz/plugins/folder|文件树插件]]

- 实现了基于 `order` 属性的自定义排序逻辑。
- 支持空文件夹（不含 `index.md`）仅折叠而不展示自动生成的目录页。

## [[/obsidian/quartz/plugins/graph|关系图谱插件]]

- 新增“标签节点”切换开关，可动态开启或隐藏图谱中的 `#标签` 节点。
- 针对 Obsidian 风格打磨了节点大小与文字显现效果。

## [[/obsidian/quartz/plugins/backlink|反向链接插件]]

- 实现了反向链接的精准跳转，点击可定位到源文档的具体引用位置。
- 增强了 Popover 预览体验，鼠标悬停即可查看引用的上下文。

## [[/obsidian/quartz/plugins/highlight|高亮插件]]

- 解决了 `==[[链接]]==` 语法冲突导致高亮失效的问题。
- 通过自定义插件优化了解析顺序，实现了高亮与链接的完美嵌套。

## [[/obsidian/quartz/plugins/code-folding|折叠代码块插件]]

- 实现了通过 `fold` 关键字快速折叠长代码块的功能。
- 支持自定义折叠标题，并兼容原有的 `title` 语法。

## [[/obsidian/quartz/plugins/callout|标注插件]]

- 引入了 `:::` 容器语法，解决了原生标注每行都需要加 `>` 的痛点。
- 支持无限嵌套、折叠控制以及在 Markdown 中直接自定义颜色和图标。

## [[/obsidian/quartz/plugins/image-zoom|图片放大插件]]

- 集成了 `medium-zoom` 库，支持点击文章图片平滑放大。
- 背景色自动适配深浅色模式，提供沉浸式查阅体验。

## [[/obsidian/quartz/plugins/pangu|中英文自动空格插件]]

- 实现了中英文、中文数字之间的自动空格功能。
- 提升了排版质量和阅读体验。

## [[/obsidian/quartz/plugins/todo|待办事项插件]]

- 实现了全站 TODO 的自动收集与汇总展示。
- 支持首页显示最新待办，并提供精确的 Popover 预览定位功能。
