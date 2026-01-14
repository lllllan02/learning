---
title: 关系图谱效果调整
draft: false
tags:
  - Obsidian
  - Quartz
  - 图谱
aliases:
cssclasses:
date: 2026-01-14
order: 1
---
本文记录了为了让 Quartz 图谱效果更接近 Obsidian 风格所做的调整，包括对 `quartz.layout.ts` 配置的详细中文说明。

## 核心配置详解 (`quartz.layout.ts`)

以下是针对 `localGraph`（局部图谱）和 `globalGraph`（全局图谱）的配置参数及其作用：

```typescript
Component.Graph({
  localGraph: {
    drag: true,          // 是否允许鼠标拖动节点
    zoom: true,          // 是否允许使用鼠标滚轮缩放图谱
    depth: 1,            // 局部图谱显示的层级深度（1 表示只显示与当前页直接相连的页面）
    scale: 1.1,          // 图谱初始加载时的缩放比例
    repelForce: 0.9,     // 节点之间的排斥力。值越大，节点分布越稀疏，防止重叠
    centerForce: 0.3,    // 节点向中心聚集的向心力
    linkDistance: 60,    // 节点之间连线的默认长度。增加此值可以为标签留出更多空间
    fontSize: 0.8,       // 文字标签的字体大小比例
    opacityScale: 8,     // 文字透明度随缩放变化的速率。值越高，文字在缩小时也越清晰可见
    showTags: true,      // 是否在图谱中显示标签（Tags）节点
    removeTags: [],      // 需要从图谱中过滤掉的特定标签
    enableRadial: true,  // 是否启用径向布局，开启后节点会倾向于形成圆形簇，视觉更接近 Obsidian
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,           // 全局图谱的深度设定为 -1，表示显示全库所有连接
    scale: 0.9,          // 全局视图初始缩放比例通常略小，以容纳更多内容
    repelForce: 0.9,
    centerForce: 0.3,
    linkDistance: 60,
    fontSize: 0.8,
    opacityScale: 8,
    showTags: true,
    removeTags: [],
    enableRadial: true,
  },
})
```

## 除配置外的代码级修改

为了达到最佳视觉效果，我们还对 Quartz 的内部渲染脚本进行了以下调整：

1. **增大节点（点）的大小**：
   在 `quartz/components/scripts/graph.inline.ts` 中，修改 `nodeRadius` 函数，将基础半径从 `2` 提高到了 `6`：

   ```typescript
   function nodeRadius(d: NodeData) {
     const numLinks = graphData.links.filter(
       (l) => l.source.id === d.id || l.target.id === d.id,
     ).length
     return 6 + Math.sqrt(numLinks) // 原始值为 2
   }
   ```

2. **文字默认显示与间距优化**：
   在同一文件中，找到创建 `label` 的位置，修改 `alpha` 和 `anchor`：

   ```typescript
   const label = new Text({
     interactive: false,
     eventMode: "none",
     text: n.text,
     alpha: 1,                  // 原始值为 0，改为 1 实现默认显示
     anchor: { x: 0.5, y: 2.2 }, // 原始值为 1.2，改为 2.2 增加字点间距
     style: {
       fontSize: fontSize * 15,
       // ... 其他样式
     }
   })
   ```

3. **缩放时的透明度逻辑优化**：
   修改缩放时计算文字可见度的公式，去掉缓冲：

   ```typescript
   // zoom adjusts opacity of labels too
   const scale = transform.k * opacityScale
   let scaleOpacity = Math.max(scale - 1, 0) // 原始值为 Math.max((scale - 1) / 3.75, 0)
   ```
