---
title: Quartz 4 深度定制
tags:
  - Obsidian
  - Quartz
date: 2026-01-15
---

[Quartz](https://quartz.jzhao.xyz/) 是一个快速、可高度定制且开源的静态站点生成器，旨在将你的 [Obsidian](https://obsidian.md/) 笔记发布到网络上。如果你是第一次使用，可以参考官方文档进行部署。

欢迎来到 Quartz 4 定制说明章节。这里记录了为了让 Quartz 博客更贴近 Obsidian 原生体验，以及提升交互效率所做的深度优化。

## 自定义插件功能

本章节主要包含以下深度定制的自定义插件：

1.  **[[/obsidian/quartz/folder|自定义文件树插件]]**：
    *   实现了基于 `order` 属性的自定义排序逻辑。
    *   支持空文件夹（不含 `index.md`）仅折叠而不展示自动生成的目录页。
2.  **[[/obsidian/quartz/graph|自定义关系图谱插件]]**：
    *   新增“放大当前图谱”功能，支持局部视图的全屏查阅。
    *   新增“标签节点”切换开关，可动态开启或隐藏图谱中的 `#标签` 节点。
    *   针对 Obsidian 风格打磨了节点大小与文字显现效果。
3.  **[[/obsidian/quartz/backlink|自定义反向链接插件]]**：
    *   实现了反向链接的精准跳转，点击可定位到源文档的具体引用位置。
    *   增强了 Popover 预览体验，鼠标悬停即可查看引用的上下文。
4.  **[[/obsidian/quartz/highlight|自定义高亮插件]]**：
    *   解决了 `==[[链接]]==` 语法冲突导致高亮失效的问题。
    *   通过自定义插件优化了解析顺序，实现了高亮与链接的完美嵌套。
5.  **[[/obsidian/quartz/code-folding|自定义折叠代码块插件]]**：
    *   实现了通过 `fold` 关键字快速折叠长代码块的功能。
    *   支持自定义折叠标题，并兼容原有的 `title` 语法。
6.  **[[/obsidian/quartz/callout|自定义标注插件]]**：
    *   引入了 `:::` 容器语法，解决了原生标注每行都需要加 `>` 的痛点。
    *   支持无限嵌套、折叠控制以及在 Markdown 中直接自定义颜色和图标。
7.  **[[/obsidian/quartz/image-zoom|自定义图片放大插件]]**：
    *   集成了 `medium-zoom` 库，支持点击文章图片平滑放大。
    *   背景色自动适配深浅色模式，提供沉浸式查阅体验。
8.  **[[/obsidian/quartz/pangu|自定义中英文空格插件]]**：
    *   通过自定义 Transformer 插件实现中英文及数字之间的自动空格。
    *   基于 `mdast-util-find-and-replace` 实现，不影响代码块和链接。

## 样式与布局定制

*   **[[/obsidian/quartz/homepage|首页美化]]**：记录了对首页布局、动态组件及视觉样式的深度定制.
*   **[[/obsidian/quartz/fonts|设置字体]]**：介绍了如何引入并配置如“霞鹜文楷”等第三方中文字体。
*   **[[/obsidian/quartz/images|图片居中与并排]]**：实现了图片的全局自动居中以及多图并排显示的布局。
*   **[[/obsidian/quartz/image-row|图片并排显示]]**：记录了通过 `<div class="image-row">` 实现图片横向排版的实现方案。

## 使用指南

*   **[[/obsidian/quartz/syntax-highlighting|代码高亮使用指南]]**：记录了 Quartz 中标准代码块、行高亮、单词高亮等语法的使用方法。

---

## 相关资源
- [Quartz 4 官方仓库](https://github.com/jackyzha0/quartz)
- [Quartz 4 官方文档](https://quartz.jzhao.xyz/)
