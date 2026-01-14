---
title: 自定义文件和文件夹排序
tags:
  - Obsidian
  - Quartz
  - 导航
date: 2026-01-14
order: 3
---

默认情况下，Quartz 的文件树（Explorer）按照“文件夹在前，文件在后”以及“字母顺序”进行排序。本教程介绍如何通过在 Frontmatter 中添加 `order` 属性来完全自定义文件和文件夹的顺序。

## 使用方法

在任意 Markdown 文件的 Frontmatter（属性区域）中添加 `order` 或 `priority` 字段，并赋予一个数字。

### 核心规则：
1. **显式排序优先**：拥有 `order` 属性的文件/文件夹会始终排在**没有**该属性的项之前。
2. **数值越小越靠前**：例如，`order: 1` 的项会排在 `order: 10` 之前。
3. **回退机制**：如果两个文件都没有 `order` 属性，或者它们的 `order` 数值相同，Quartz 将回退到默认的**字母顺序**进行排序。
4. **层级独立**：排序规则仅在同一文件夹层级内生效，不影响文件夹内部的嵌套结构。

### 1. 置顶特定文件
数值越小，排序越靠前。

```markdown
---
title: 欢迎来到我的博客
order: 1
---
```

### 2. 控制文件夹顺序
若要控制文件夹在列表中的顺序，需要编辑该文件夹下的 `index.md` 文件：

```markdown
---
title: 核心教程
order: 2
---
```

## 核心实现说明（进阶）

如果你需要了解或修改底层逻辑，可以查看以下文件：

### 1. 数据导出修改
**文件路径**：`quartz/plugins/emitters/contentIndex.tsx`

在此文件中，我们需要做两处修改：

1.  **定义类型**（约第 12 行）：在 `ContentDetails` 类型定义中增加 `order` 字段。

```typescript showLineNumbers{12} {11}
export type ContentDetails = {
  slug: FullSlug
  filePath: FilePath
  title: string
  links: SimpleSlug[]
  tags: string[]
  content: string
  richContent?: string
  date?: Date
  description?: string
  order?: number
}
```

2.  **提取数据**（约第 119 行）：在 `emit` 函数的循环中，从文件的 Frontmatter 里读取 `order` 或 `priority`。

```typescript showLineNumbers{106} {13}
linkIndex.set(slug, {
  slug,
  filePath: file.data.relativePath!,
  title: file.data.frontmatter?.title!,
  links: file.data.links ?? [],
  tags: file.data.frontmatter?.tags ?? [],
  content: file.data.text ?? "",
  richContent: opts?.rssFullHtml
    ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
    : undefined,
  date: date,
  description: file.data.description ?? "",
  order: (file.data.frontmatter?.order as number | undefined) ?? (file.data.frontmatter?.priority as number | undefined),
})
```

### 2. 排序函数更新
**文件路径**：`quartz.layout.ts`

为了保持代码整洁并避免在多个布局中重复，建议先定义一个通用的排序函数，然后再引用它。

1. **定义通用排序函数**（建议放在文件顶部）：首先需要引入 `FileTrieNode` 类型，然后定义排序函数。

```typescript
import { FileTrieNode } from "./quartz/util/fileTrie"

const explorerSortFn = (a: FileTrieNode, b: FileTrieNode) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    // 优先处理带有 order 属性的项
    if (a.data?.order !== undefined && b.data?.order !== undefined) {
      return a.data.order - b.data.order
    }
    if (a.data?.order !== undefined) return -1
    if (b.data?.order !== undefined) return 1

    // 默认字母排序
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  // 默认保持文件夹在上方，文件在下方
  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}
```

2. **在布局配置中引用**：在 `defaultContentPageLayout` 和 `defaultListPageLayout` 中同时应用排序函数。

```typescript
Component.Explorer({
  sortFn: explorerSortFn,
}),
```
