---
title: 文件树优化
tags:
  - Quartz
  - 文件夹
date: 2026-01-15
order: 1
---

本文记录了对 Quartz 文件树（Explorer）进行的深度定制。通过创建自定义组件 `CustomExplorer`，我们实现了“取消空文件夹目录展示”以及“基于属性的自定义排序”两项核心增强。

## 实现逻辑

在自定义组件中，我们对文件树的生成与排序逻辑进行了以下优化：

### 1. 取消空文件夹的自动目录
在渲染文件树时，系统会智能判断文件夹内容：
- **有内容的文件夹**：若包含 `index.md`，则渲染为 `<a>` 链接，点击正常跳转。
- **空文件夹**：若不含 `index.md`，则降级为 `<button>`，点击仅触发展开/折叠，避免进入空白的自动生成目录页。

### 2. 内置自定义排序 (order)
我们将原本分散在布局文件中的排序逻辑集成到了 `CustomExplorer` 组件内部。现在，你可以通过在 Markdown 文件的 Frontmatter 中添加 `order` 属性来控制显示顺序：

```markdown
---
title: 某篇笔记
order: 1  # 数值越小越靠前
---
```

**排序规则：**
1. **显式排序优先**：拥有 `order` 属性的项始终排在没有该属性的项之前。
2. **数值排序**：按 `order` 数值升序排列。
3. **回退机制**：若 `order` 相同或缺失，则回退到默认的“文件夹在前 + 字母顺序”排列。

## 维护建议

### 1. 组件注册
在 `quartz/components/index.ts` 中完成组件导出：

```typescript
// quartz/components/index.ts
import CustomExplorer from "./CustomExplorer"

export {
  // ... 其他组件
  CustomExplorer,
}
```

### 2. 布局应用
由于功能已高度封装，在 `quartz.layout.ts` 中仅需一行调用，无需额外传入排序函数：

```typescript
// quartz.layout.ts
left: [
  // ... 其他组件
  Component.CustomExplorer(),
],
```

### 3. 相关文件
所有增强逻辑均封装在以下文件中，已同步至 GitHub 仓库：
- [quartz/components/CustomExplorer.tsx](https://github.com/lllllan02/blog/blob/main/quartz/components/CustomExplorer.tsx)
- [quartz/components/scripts/custom-explorer.inline.ts](https://github.com/lllllan02/blog/blob/main/quartz/components/scripts/custom-explorer.inline.ts)

这种自定义组件模式确保了官方核心代码的纯净，极大地简化了后续的系统升级工作。
