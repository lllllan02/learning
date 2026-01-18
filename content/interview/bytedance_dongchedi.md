---
title: 字节跳动｜懂车帝｜校招｜二面
tags:
    - 字节跳动
    - 懂车帝
    - 后端
    - 校招
    - 面经
date:
order:
---

> [15.字节跳动-懂车帝后端校招二面（挂）| 牛客网](https://www.nowcoder.com/feed/main/detail/7473702c27b244e7b033f323386a522b)

## 1. [[golang/question/panic_in_goroutine|Goroutine 中出现 panic 会发生什么]]

如果任何一个子 Goroutine 发生了 panic，且该 Goroutine 内部没有使用 `defer` + `recover` 来拦截它，那么整个程序（包括主 Goroutine 和其他所有正在运行的 Goroutine）都会立即终止。

## 2. [[golang/question/latency_in_gc|Golang 的 GC 什么时候回出现卡顿]]

延长 STW（Stop-The-World）导致的程序“绝对停顿”（如抢占延迟、海量协程栈扫描）以及因资源竞争和 GC 协助（Mark Assist）导致的业务“响应变慢”（吞吐量下降）两大类核心因素。


## 其他问题

- [ ] 清理过程会出现stw吗？
- [ ] 手撕：零钱兑换
- [ ] 文件描述符是什么
- [ ] Io多路复用说一下
- [ ] 为什么epoll底层用红黑树管理？
- [ ] 为什么select的文件描述符集合是有序的？
- [ ] 异步io和非阻塞io？