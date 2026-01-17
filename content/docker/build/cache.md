---
title: 使用构建缓存
tags:
    - Docker
    - Build
    - Cache
date: 2026-01-17
order: 3
---

> [Using the build cache | Docker 官方文档](https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "./src/index.js"]
```

当你运行 `docker build` 命令创建新镜像时，Docker 会执行 [[docker/build/dockerfile_|Dockerfile]] 中的每条指令，按照指定顺序为每个命令创建一个[[docker/build/layer|层]]。对于每条指令，Docker 会检查是否可以重用之前构建中的该指令。如果发现你之前已经执行过类似的指令，Docker 就无需重新执行，而是会使用缓存的结果。这样，你的构建过程会变得更快、更高效，节省宝贵的时间和资源。

- 对 `RUN` 指令的命令所做的任何更改都会使该层失效。如果 Dockerfile 中的 RUN 命令有任何修改，Docker 会检测到该更改并使构建缓存失效。
- 使用 `COPY` 或 `ADD` 指令复制到镜像中的文件发生的任何更改。Docker 会密切关注项目目录内文件的任何变动。无论是内容的更改，还是权限等属性的变化，Docker 都会将这些修改视为使缓存失效的触发因素。
- 一旦某一层失效，所有后续的层也会失效。如果任何之前的层（包括基础镜像或中间层）因更改而失效，Docker 会确保依赖它的后续层也失效。这能使构建过程保持同步，并防止出现不一致的情况。

在编写或编辑 Dockerfile 时，要留意不必要的缓存失效问题，以确保构建过程尽可能快速高效地运行。