---
title: Docker Image 
tags: 
  - Docker
  - Image
date: 2026-01-15
order: 2
---

> [What is an image? | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)

==镜像是一个包含了运行容器所需所有文件的标准化包==。好比做一道菜的菜谱、一栋建筑的图纸、一个游戏的安装包，镜像就是搭建出容器的模板。

镜像有两个重要原则：

1. **不可改变**。一旦生成了镜像，就无法被修改。你只能创建新镜像或在其上添加更改。
2. **多层组成**。容器镜像由多层组成。每一层代表一组文件系统变更，用于添加、删除或修改文件。

下一步，了解 [[docker/concept/registry|Docker Registry]] 之后从 [Docker Hub](https://hub.docker.com/) 寻找你需要的镜像。