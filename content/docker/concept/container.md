---
title: Docker Container 
tags: 
  - Docker
  - Container
date: 2026-01-15
order: 1
---

[什么是容器 | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)。

简单来说，==容器是针对你应用中每个组件的独立进程==。

- **Self-contained** 自成一体。每个容器都具备运行所需的一切，无需依赖主机上预装的依赖。
- **Isolated** 孤立无援。由于容器是独立运行的，它们对主机和其他容器的影响很小，从而提升了应用的安全性。
- **Independent** 独立。每个集装箱都独立管理。删除一个容器不会影响其他容器。
- **Portable** 便携式。集装箱可以运行到任何地方！运行在你开发机器上的容器，在数据中心或云端任何地方都能以同样的方式工作！

下一步，阅读 [[docker/concept/image|什么是 Docker Image]]。