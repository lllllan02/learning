---
title: Docker Registry
tags:
  - Docker
  - Registry
date:
order: 3
---

>[What is a registry? | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/)

## 什么是 Registry

**Registry 是一个集中存储和[[docker/concept/container|容器]][[docker/concept/image|镜像]]的地方**。它可以是公共的，也可以是私人的。[Docker Hub](https://hub.docker.com/) 是一个任何人都可以使用的公共注册表，也是默认注册表。

更多受欢迎的公共注册表包括：

- [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/)
- [Azure Container Registry (ACR)](https://azure.microsoft.com/en-in/products/container-registry)
- [Google Container Registry (GCR)](https://cloud.google.com/artifact-registry)

也可以搭建自己的私有注册表，比如 

- [Harbor](https://goharbor.io/)
- [JFrog Artifactory](https://jfrog.com/artifactory/)
- [GitLab Container registry](https://docs.gitlab.com/user/packages/container_registry/)

## Registry 和 Repository 的区别

从翻译角度来说，Registry 是注册表，Repository 则是仓库。日常使用中可能会把 Registry 和 Repository 混为一谈，但他们有一些区别和关联。

注册表是一个集中存储和管理容器镜像的地方，而仓库则是注册表内相关容器镜像的集合。把它想象成一个文件夹，用来根据项目整理你的图片。每个仓库包含一个或多个容器镜像。

![[assets/Pasted image 20260115175513.png|300x284]]