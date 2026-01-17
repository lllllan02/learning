---
title: Docker Compose 和 Dockerfile
tags: 
  - Docker
  - Dockerfile
  - Docker Compose
date: 2026-01-17
---

[[/docker/build/dockerfile_|Dockerfile]] 和 [[/docker/concept/compose|Docker Compose]] 是 Docker 生态中两个核心工具，它们分别负责不同的阶段：**构建**与**运行编排**。

## Dockerfile：定义“镜像” (The Recipe)

**Dockerfile** 是一个自动化脚本，包含了一系列指令，用于指导 Docker 如何**构建一个容器镜像**。

- **作用对象**：单个镜像。
- **关注点**：内部环境搭建（安装依赖、拷贝代码、设置环境变量、定义启动命令）。
- **产物**：一个静态的镜像文件。

## Docker Compose：定义“应用/服务” (The Blueprint)

**Docker Compose** 是一个声明式的配置文件（通常是 `docker-compose.yml`），用于**定义和运行多容器应用**。

- **作用对象**：整个应用系统（包含多个容器、网络、卷）。
- **关注点**：容器间的协作（端口映射、网络连接、启动顺序、数据持久化）。
- **产物**：一组相互协作的动态容器集群。

## 核心区别

| 维度 | Dockerfile | Docker Compose |
| :--- | :--- | :--- |
| **层级** | 基础 / 单个组件 | 顶层 / 整个系统 |
| **主要任务** | **Build** (构建镜像) | **Run** (管理和启动服务) |
| **使用命令** | `docker build` | `docker compose up` |
| **本质** | 制作“软件包”的过程 | 运行“软件包”的配置说明 |

## 协作关系

在实际开发中，它们通常是配合使用的：

1. 你通过 **Dockerfile** 定义如何构建你的应用（如 Node.js 或 Python 服务）。
2. 在 `docker-compose.yml` 中，你定义如何运行这个应用，以及它如何与数据库（如 MySQL、Redis）等其他服务连接。
3. 一个 `docker compose up` 命令就能根据 Dockerfile 自动构建镜像并启动所有相关服务。

> **比喻总结**：Dockerfile 是**单个建筑的“设计蓝图”**；Docker Compose 是**整个社区的“规划方案”**（它不仅决定了需要哪些建筑，还定义了它们如何通过道路、供水和电力系统相互连接）。
