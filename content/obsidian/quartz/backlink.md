---
title: 反向链接优化记录 
tags:
  - Quartz
  - 反向链接
  - 优化
date: 2026-01-15
order: 6
---


本文记录了对 Quartz 反向链接（Backlinks）进行的优化尝试，包括如何实现跳转到具体引用位置及预览增强，以及当前存在的遗留问题。

## 1. 优化目标
原生的 Quartz 反向链接仅支持跳转到源文档的顶部。通过本优化，我们希望点击反向链接时能直接定位到源文档中**具体引用当前页面**的位置，并在鼠标悬停时，利用 Quartz 的 Popover 机制自动预览该引用的上下文。

## 2. 修改步骤

### 第一步：修改链接转换插件 (`quartz/plugins/transformers/links.ts`)
目的是在解析 Markdown 时，为每一个指向内部页面的链接生成一个唯一的 ID（锚点），并将其记录在文件的元数据中。

> [!warning] 怕出错？直接复制[整个文件](https://github.com/lllllan02/blog/blob/main/quartz/plugins/transformers/links.ts)直接替换

1. 在 `htmlPlugins` 的转换逻辑中，初始化计数器和元数据容器：

```typescript showLineNumbers{51} {1-2}{6-7}
let linkCount = 0
const backlinksMetadata: Record<SimpleSlug, string[]> = {}
visit(tree, "element", (node, _index, _parent) => {
...
})
file.data.links = [...outgoing]
file.data.backlinksMetadata = backlinksMetadata
```

2. 在处理内部链接的逻辑中，为链接节点添加 ID，并记录到 `backlinksMetadata`：

```typescript showLineNumbers{105} {23-29}
if (isInternal) {
  dest = node.properties.href = transformLink(
    file.data.slug!,
    dest,
    transformOptions,
  )

  // url.resolve is considered legacy
  // WHATWG equivalent https://nodejs.dev/en/api/v18/url/#urlresolvefrom-to
  const url = new URL(dest, "https://base.com/" + stripSlashes(curSlug, true))
  const canonicalDest = url.pathname
  let [destCanonical, _destAnchor] = splitAnchor(canonicalDest)
  if (destCanonical.endsWith("/")) {
    destCanonical += "index"
  }

  // need to decodeURIComponent here as WHATWG URL percent-encodes everything
  const full = decodeURIComponent(stripSlashes(destCanonical, true)) as FullSlug
  const simple = simplifySlug(full)
  outgoing.add(simple)
  node.properties["data-slug"] = full

  const anchor = (node.properties.id as string) || `backlink-${linkCount++}`
  node.properties.id = anchor

  if (!backlinksMetadata[simple]) {
    backlinksMetadata[simple] = []
  }
  backlinksMetadata[simple].push(anchor)
}
```

3. 扩展 `vfile` 的类型定义，确保 TypeScript 不报错：

```typescript showLineNumbers{181} {4}
declare module "vfile" {
  interface DataMap {
    links: SimpleSlug[]
    backlinksMetadata: Record<SimpleSlug, string[]>
  }
}
```


### 第二步：修改反向链接组件 (`quartz/components/Backlinks.tsx`)


> [!warning] 怕出错？直接复制[整个文件](https://github.com/lllllan02/blog/blob/main/quartz/components/Backlinks.tsx)直接替换


修改组件渲染逻辑，从源文件的元数据中提取对应的锚点 ID，并拼接到跳转链接中。

```tsx showLineNumbers{36}
backlinkFiles.map((f) => (
  <li>
    <a href={resolveRelative(fileData.slug!, f.slug!)} class="internal">
      {f.frontmatter?.title}
    </a>
  </li>
))
```

```tsx showLineNumbers{36} {2,3,6}
backlinkFiles.map((f) => {
  const anchors = f.backlinksMetadata?.[slug] || []
  const firstAnchor = anchors.length > 0 ? `#${anchors[0]}` : ""
  return (
    <li>
      <a href={resolveRelative(fileData.slug!, f.slug!) + firstAnchor} class="internal">
        {f.frontmatter?.title}
      </a>
    </li>
  )
})
```

## 3. 实现效果
*   **预览增强**：鼠标悬停在反向链接上时，Popover 预览框会自动根据 URL 中的哈希值（如 `#backlink-0`）定位到文档中对应的 ID 位置。这使得用户可以不离开当前页面就看到引用处的详细内容（如图片、上下文段落）。
*   **点击跳转**：点击链接后，浏览器会自动滚动到该引用位置。

## 4. 遗留问题
虽然预览效果非常理想，但实际的点击跳转（Scroll into view）仍存在以下优化空间：

1.  **浏览器默认对齐问题**：浏览器默认会将带 ID 的元素对齐到视口最顶端。如果引用位置位于段落中间，跳转后该行文字会紧贴顶部，导致丢失上方的上下文感。
2.  **图片加载干扰**：如果源文档中包含大量图片且未设置固定高度，页面在滚动时若图片尚未完全加载，会导致最终定位偏差。
3.  **多处引用处理**：目前反向链接默认仅跳转到该文件内“第一次”引用的位置。如果一个文件多次引用了当前页，侧边栏的反向链接无法区分。
4.  **SPA 路由竞争**：在开启 SPA 模式时，Quartz 的滚动处理与浏览器的原生锚点跳转有时会产生冲突，导致滚动不够平滑或瞬间跳变。

## 5. 结论
目前的方案实现了 **“反向链接 + 自动定位预览”** 的组合，对于快速查看文档引用关系非常高效。由于跳转定位的复杂性，目前保留了最基础稳定的实现，优先保证预览体验。
