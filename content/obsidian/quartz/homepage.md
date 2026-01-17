---
title: 首页美化与布局定制
tags:
  - Quartz
  - 首页
date: 2026-01-16
order: 9
---

本文详细记录了对 Quartz 首页进行的深度美化过程，包括 Markdown 内容重构、布局组件的条件渲染以及 CSS 样式的精细调节。

## 1. 首页 Markdown 内容重构 (`index.md`)

我们摒弃了传统的列表式首页，改用 **Hero + Grid 导航** 的结构。

### Hero 区域
使用内联 HTML 实现居中的欢迎语，打破 Markdown 默认的左对齐排版。

```html
<div style="text-align: center; margin-bottom: 2rem;">
  <h1>👋 你好！我是 lllllan</h1>
  <p style="font-size: 1.2rem; color: var(--gray);">后端开发 | 终身学习者 | 记录者</p>
</div>
```

### 探索地图 (Grid 导航)
结合 Quartz 的 Callout 语法和 CSS Grid，将核心板块以卡片形式呈现。

```markdown
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">

> [!abstract] 知识沉淀
> 涵盖后端开发、基础架构以及深度学习的心得与笔记。
> [Docker](/docker/concept)

> [!tip] 各种分享
> 分享一些我觉得不错的 [[github/star|GitHub 仓库]]、动漫、书籍等。

> [!quote] 随笔思考
> 一些不成体系的想法、日常记录和复盘。待补充...

</div>
```

## 2. 布局组件的条件渲染 (`quartz.layout.ts`)

为了让首页具备动态感，我们在正文下方引入了“最近更新”组件，并通过 `ConditionalRender` 确保其仅在首页展示。

### 添加动态组件
在 `afterBody` 中配置 `RecentNotes`：

```typescript
// quartz.layout.ts
import { SimpleSlug } from "./quartz/util/path"

export const sharedPageComponents: SharedLayout = {
  // ...
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "最近更新",
        limit: 1, // 控制显示数量
        linkToMore: "tags/" as SimpleSlug,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  // ...
}
```

> [!warning] 类型提示
> Quartz 路径使用 Nominal Typing。配置 `linkToMore` 时，必须使用 `as SimpleSlug` 进行类型断言，否则会报“string 不能赋值给 SimpleSlug”的错误。

## 3. 全局页脚优化

将站点信息（如 GitHub 链接、字体声明）从 Markdown 首页抽离，放入全局页脚，使所有页面保持一致。

```typescript
// quartz.layout.ts
footer: Component.Footer({
  links: {
    GitHub: "https://github.com/lllllan02", 
    Font: "https://github.com/lxgw/LxgwWenKai",
  },
}),
```

## 4. 样式微调 (`custom.scss`)

通过 `custom.scss` 解决首页的视觉冗余，并增强交互体验。

### 首页视觉降噪
针对首页隐藏默认的标题和日期元数据，防止与自定义的 Hero 区域冲突。

```scss
// quartz/styles/custom.scss
body[data-slug="index"] {
  .article-title {
    display: none; // 隐藏默认标题
  }

  .content-meta {
    display: none; // 隐藏默认日期/阅读时间
  }
}
```

### Callout 卡片美化
为导航卡片添加现代化的交互感。

```scss
.callout {
  margin: 1rem 0;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px); // 悬停上浮
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); // 增加阴影深度
  }
  
  .callout-title {
    font-weight: 600;
  }
}
```

---

通过这几步改动，首页从一个简单的“文件索引”转变为一个功能完整、具备现代 Web 感官的个性化门户。
