---
title: 图片并排显示
tags:
  - Quartz
  - 图片
  - 布局
date: 2026-01-17
order: 12
---

本文档记录了如何在 Quartz 中实现多张图片在同一行并排显示的自定义修改。

## 需求描述

在某些场景下（如对比图、步骤图），我们需要将两张或多张图片水平排列，而不是默认的垂直堆叠。同时需要保证在手机等窄屏设备上能够自动切换为垂直布局。

## 使用方法

在 Markdown 中，使用 `<div class="image-row">` 标签包裹图片。

::: [!important] 注意
为了确保 Quartz 能正确解析图片语法，请务必在 HTML 标签和图片 Markdown 语法之间**保留空行**。
:::

```markdown
<div class="image-row">

![[image1.png]]
![[image2.png]]

</div>
```

## CSS 实现

在 `quartz/styles/custom.scss` 中添加了以下样式：

```scss
// 图片并排显示容器
.image-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;            // 图片间的间距
  margin: 1.5rem 0;     // 容器上下间距
  align-items: flex-start;

  // 手机端自适应：宽度小于 600px 时改为垂直排列
  @media all and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }

  // 处理图片包裹容器（如 p, a 等）
  & > * {
    margin: 0 !important;
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: calc(50% - 0.5rem); // 默认为两列布局

    @media all and (max-width: 600px) {
      max-width: 100%;
      width: 100%;
    }
    
    // 兼容某些 Markdown 渲染器自动生成的 p 标签
    p {
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }

  // 图片本身样式
  img {
    display: block;
    margin: 0 !important;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
}
```

## 实现原理

1.  **Flexbox 布局**: 使用 `display: flex` 轻松实现水平排列，并利用 `gap` 控制间距。
2.  **子元素约束**: 通过 `& > *` 选中直接子元素，设置 `max-width: calc(50% - 0.5rem)` 确保两张图片平分宽度。
3.  **响应式设计**: 使用 `@media` 查询，在小屏幕上将 `flex-direction` 切换为 `column`，使图片恢复为垂直堆叠，避免图片过小。
4.  **Markdown 兼容性**: 增加了对 `p` 标签的处理，因为 Quartz (基于 Rehype/Remark) 有时会将孤立的图片包裹在段落标签中。
