---
title: 关系图谱优化
draft: false
tags:
  - Obsidian
  - Quartz
  - 图谱
date: 2026-01-15
order: 2
---

本文记录了对 Quartz 关系图谱进行的深度定制与功能增强，旨在提升图谱的交互体验与视觉表现力。通过创建自定义组件 `CustomGraph`，我们在保留官方核心功能的基础上，实现了多项实用功能。

## 实现效果

### 1. 局部图谱全屏缩放
在原有局部图谱的基础上，我们在右上角新增了一个 **放大（Maximize）** 按钮（图标为 `↗`）。
- **点击效果**：点击后会弹出一个全屏覆盖层，专门展示当前页面的局部关系图。
- **上下文保留**：与全局图谱不同，该功能专注于展示“当前笔记”的连接关系，适合在笔记较多时进行深度查阅。

### 2. 右上角交互布局优化
重新设计了图谱右上角的控制区域：
- **布局顺序**：左侧为“全局图谱”图标，右侧为新的“全屏放大”图标，符合主流视觉操作逻辑。
- **图标更新**：使用了更直观的箭头图标，增强了视觉指引。

### 3. 全屏模式下的交互增强
在全屏弹出层中，我们进一步增强了控制功能：
- **按钮布局**：右上角的控制按钮采用垂直排列，且每个组件（标签切换、深度调节）都拥有统一的固定尺寸，视觉上更加整齐。
- **标签节点控制**：新增了“标签节点”切换开关，支持一键开启或隐藏图谱中的 `#标签` 节点，并触发动态重绘。
- **智能深度调节**：
    - **手动调节**：支持通过 `+` 和 `-` 按钮实时增减局部图谱的探测深度。
    - **智能极限探测**：在增加深度时，程序会自动计算。如果当前深度已经包含了该连通分量的所有节点（即增加深度不会引入新节点），则会自动停止增长。
    - **边界保护**：禁用无效的深度循环（如从最大深度跳回 1，或从 1 跳到“全”），并提供半透明禁用状态的视觉反馈。

### 4. 视觉与自适应优化
针对不同场景进行了细节打磨：
- **自适应 UI 设计**：
    - **全屏模式**：提供完整的交互体验，显示图标与文字标签（如“深度: 1”）。
    - **侧边栏模式**：自动隐藏深度调节器，并收缩“标签节点”按钮，仅保留图标，以保持侧边栏的简洁和阅读专注度。
- **节点增强**：增大了节点的基础半径，使其在复杂网络中更易被识别。
- **文字排版**：优化了文字标签（Label）相对于节点的距离（Anchor），并调整了缩放时的显现算法，使文字在缩放过程中过渡更平滑。

## 参数配置

在 [`quartz.layout.ts`](https://github.com/lllllan02/blog/blob/main/quartz.layout.ts) 中，我们对图谱的物理模拟和视觉样式进行了精细调优，以达到类似 Obsidian 的效果：

```typescript
const graphConfig = {
  localGraph: {
    drag: true, // 是否允许拖拽节点
    zoom: true, // 是否允许缩放
    depth: 1, // 本地图谱显示的链接深度
    scale: 1.1, // 初始缩放比例
    repelForce: 0.9, // 节点间的斥力系数
    centerForce: 0.3, // 节点向中心的向心力系数
    linkDistance: 60, // 链接的默认距离
    fontSize: 0.8, // 标签字体大小
    opacityScale: 8, // 节点透明度缩放系数
    showTags: true, // 是否显示标签节点
    removeTags: [], // 要在图谱中隐藏的标签
    enableRadial: true, // 是否启用径向布局
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.9,
    centerForce: 0.3,
    linkDistance: 60,
    fontSize: 0.8,
    opacityScale: 8,
    showTags: true,
    removeTags: [],
    enableRadial: true,
  },
}
```

## 维护建议

### 1. 组件注册
为了让自定义组件生效，需要在 `quartz/components/index.ts` 中完成导出，这样才能在布局配置中通过 `Component.CustomGraph` 访问：

```typescript
// quartz/components/index.ts
import CustomGraph from "./CustomGraph"

export {
  // ... 其他组件
  CustomGraph,
}
```

### 2. 布局应用
最后，在 [`quartz.layout.ts`](https://github.com/lllllan02/blog/blob/main/quartz.layout.ts) 中将原有的 `Component.Graph` 替换为 `Component.CustomGraph`：

```typescript
// quartz.layout.ts
right: [
  Component.CustomGraph(graphConfig), // 使用增强版自定义图谱
  // ... 其他组件
],
```

### 3. 相关文件
由于采用了**自定义组件**模式，所有修改都集中在以下文件中：
- [quartz/components/CustomGraph.tsx](https://github.com/lllllan02/blog/blob/main/quartz/components/CustomGraph.tsx)
- [quartz/components/scripts/custom-graph.inline.ts](https://github.com/lllllan02/blog/blob/main/quartz/components/scripts/custom-graph.inline.ts)
- [quartz/components/styles/custom-graph.scss](https://github.com/lllllan02/blog/blob/main/quartz/components/styles/custom-graph.scss)

这种做法可以有效避免在升级 Quartz 核心代码时产生冲突。如果需要切换回官方原生图谱，只需在 `quartz.layout.ts` 中将 `Component.CustomGraph` 改回 `Component.Graph` 即可。
