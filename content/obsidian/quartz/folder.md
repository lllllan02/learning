---
title: 取消文件夹的目录展示
tags:
  - Quartz
  - 导航
date: 2026-01-14
order: 2
---

本文件记录了如何通过修改 Quartz 核心组件逻辑，实现“空文件夹（不含 `index.md`）点击仅折叠且不显示自动生成的目录列表”的功能。

## 修改核心脚本：实现智能点击拦截

**文件路径**：`quartz/components/scripts/explorer.inline.ts`

### 智能判断文件夹是否有 index.md
修改 `createFolderNode` 函数（约 118 行）。我们将原有简单的 `link` 判断逻辑升级为“链接 + 内容存在”的双重判断。

**查找原代码位置：**
```typescript
  if (opts.folderClickBehavior === "link") {
    // Replace button with link for link behavior
    // ... 原有逻辑 ...
  } else {
    const span = titleContainer.querySelector(".folder-title") as HTMLElement
    span.textContent = node.displayName
  }
```

**替换为以下代码：**
```typescript {6}
  /**
   * 核心逻辑修改：智能判断文件夹是否有 index.md
   * 只有当文件夹确实有关联的 markdown 数据时，才渲染为 <a> 链接
   * 否则保持为 <button>，仅触发折叠/展开逻辑
   */
  if (opts.folderClickBehavior === "link" && node.data)
  ...
```

### 强制绑定折叠事件

修改 `setupExplorer` 函数（约 249 行）。我们需要移除原有的 `if` 条件包裹。

**查找原代码位置：**
```typescript {1-2,10}
    // Set up folder click handlers
    if (opts.folderClickBehavior === "collapse") {
      const folderButtons = explorer.getElementsByClassName(
        "folder-button",
      ) as HTMLCollectionOf<HTMLElement>
      for (const button of folderButtons) {
        button.addEventListener("click", toggleFolder)
        window.addCleanup(() => button.removeEventListener("click", toggleFolder))
      }
    }
```

**替换为以下代码：**
```typescript
    /**
     * 核心逻辑修改：无条件绑定文件夹点击事件
     * 确保那些因为没有 index.md 而被降级为按钮的文件夹，依然能响应点击并展开/折叠
     */
    const folderButtons = explorer.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>
    for (const button of folderButtons) {
      button.addEventListener("click", toggleFolder)
      window.addCleanup(() => button.removeEventListener("click", toggleFolder))
    }
```

