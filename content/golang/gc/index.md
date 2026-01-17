---
title: Golang GC
tags:
    - Golang
    - GC
date: 2026-01-17
order: 3
---

学习 Go GC 的最佳路径是从官方设计博客开始，逐渐深入到源码解析。以下是按深度排列的推荐清单：

## 入门与概览（官方博客）
这是了解 Go GC 演进思想的必读文章：

*   **[Go Blog: Getting to Go: The Journey of Go's Garbage Collector](https://blog.golang.org/ismmkeynote)**
    *   **推荐理由：** 这是 Go 团队负责人 Rick Hudson 在 ISMM 上的演讲稿。它解释了为什么 Go 选择“三色并发标记清除”而不是“分代式”或“压缩式”算法，以及背后的权衡（Trade-offs）。
*   **[Go Blog: Go GC: Prioritizing low latency and high throughput](https://blog.golang.org/go15gc)**
    *   **推荐理由：** 详细介绍了 Go 1.5 引入的并发 GC 机制，这是现代 Go GC 的基石。

## 深度进阶（设计文档与官方指南）
当你想要了解内部细节（如写屏障、辅助标记）时：

*   **[Go GC Guide (Official Documentation)](https://tip.golang.org/doc/gc-guide)**
    *   **推荐理由：** **最强推荐！** 这是 Go 官方在 1.19 版本推出的完整指南。它涵盖了内存管理、`GOGC` 调优、`GOMEMLIMIT` 以及如何减少 GC 开销。
*   **[Garbage Collection Design Doc](https://github.com/golang/proposal/blob/master/design/17503-eliminate-rescan.md)**
    *   **推荐理由：** 解释了如何消除 Mark Termination 阶段的重扫（Rescan），从而实现低延迟。

## 技术专家深度解析（推荐博主）
有一些开发者通过深入源码给出了极高质量的解释：

*   **[Ardan Labs: Garbage Collection In Go (Part 1-3)](https://www.ardanlabs.com/blog/2018/12/garbage-collection-in-go-part1-semantics.html)**
    *   **作者：** Bill Kennedy
    *   **推荐理由：** 非常系统地从三色标记、写屏障到调优策略分三篇进行了保姆级讲解，配图极佳。
*   **[Draveness: Go 语言设计与实现 - 垃圾回收](https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-garbage-collector/)**
    *   **语言：** 中文
    *   **推荐理由：** 国内最权威的 Go 源码解析书籍之一，对 GC 流程的图解非常清晰，涵盖了从标记、辅助标记到清理的全流程。
*   **[欧神 (changkun): Go 语言原本 - 垃圾回收](https://golang.design/under-the-hood/zh-cn/part2runtime/ch08gc/)**
    *   **语言：** 中文
    *   **推荐理由：** 适合想要深挖源码实现（Runtime 代码级分析）的开发者。

## 经典演讲（视频）
*   **[GopherCon 2018: Allocator and Garbage Collector](https://www.youtube.com/watch?v=1YJbsY4SOfw)**
    *   **推荐理由：** 深入浅出地讲解了 Go 内存分配和垃圾回收是如何配合工作的。

## 阅读建议：
1.  **先看 [Go GC Guide](https://tip.golang.org/doc/gc-guide)**：掌握 `GOGC` 和 `GOMEMLIMIT` 的用法。
2.  **次看 [Draveness 的博客](https://draveness.me/golang/docs/part3-runtime/ch07-memory/golang-garbage-collector/)**：建立完整的算法流程图。
3.  **最后看 [官方 ISMM 演讲稿](https://blog.golang.org/ismmkeynote)**：理解 Go 团队为什么不选“分代算法”的深层原因（这在面试中经常是加分项）。