---
title: Image layers 
tags: 
  - Docker
  - Image
date: 2026-01-16
order: 1
---

> [Understanding the image layers ｜ Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/)

==[[/docker/concept/image|容器镜像]]是由层组成的==。而且这些层一旦创建，就都是不可变的。

## 镜像层

Docker 镜像是由一系列只读层组成的，每一层都代表了 Dockerfile 中的一条指令。以下是该镜像的层级结构：

这是有益的，因为它允许在镜像之间重用层。例如，假设你想要创建另一个 Python 应用程序。由于分层，你可以利用相同的 Python 基础。这将加快构建速度，并减少分发镜像所需的存储和带宽。

<div class="image-row">

![[layer-20260117101335.png]]
![[layer-20260117101235.png]]

</div>

镜像允许你通过重用他人的基础镜像来扩展其镜像，这样你只需添加应用程序所需的数据即可。

## 堆叠层

分层技术借助内容可寻址存储和联合文件系统得以实现。虽然这会涉及一些技术细节，但原理如下：

1. 每个层下载完成后，会被提取到主机文件系统上其自己的目录中。
2. 当你从镜像运行容器时，会创建一个联合文件系统，其中各层堆叠在一起，形成一个新的统一视图。
3. 容器启动时，其根目录会通过 chroot 设置为这个统一目录的位置。

创建联合文件系统时，除了镜像层之外，还会专门为运行中的容器创建一个目录。这使得容器能够对文件系统进行更改，同时保持原始镜像层不受影响。这让你可以从同一个基础镜像运行多个容器。

:::[!tip] docker container commit 
[试试使用 docker container commit 命令手动创建新的镜像层](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/#try-it-out)

请注意，Dockerfile 是更常用的方式，这里是为了理解其中的工作原理
:::